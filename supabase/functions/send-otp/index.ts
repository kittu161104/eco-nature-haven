
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  email: string;
  name?: string;
  isSignUp: boolean;
  adminCode?: string;
}

// Rate limiting map to prevent spam
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const isRateLimited = (email: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(email);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit (5 OTP requests per 10 minutes)
    rateLimitMap.set(email, { count: 1, resetTime: now + 10 * 60 * 1000 });
    return false;
  }
  
  if (userLimit.count >= 5) {
    return true;
  }
  
  userLimit.count++;
  return false;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, isSignUp, adminCode }: OTPRequest = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check rate limiting
    if (isRateLimited(email)) {
      return new Response(
        JSON.stringify({ error: "Too many OTP requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiration (5 minutes)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Clean up expired OTPs first to prevent database bloat
    await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', new Date().toISOString());

    // Insert new OTP
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        email: email.toLowerCase().trim(), // Normalize email
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        is_signup: isSignUp,
        name: name || null,
        admin_code: adminCode || null
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to store OTP: ${insertError.message}`);
    }

    // Send email with OTP - using verified sender email
    const emailResponse = await resend.emails.send({
      from: "Natural Green <onboarding@resend.dev>",
      to: [email.toLowerCase().trim()], // Ensure email is normalized
      subject: `Your verification code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin: 0;">Natural Green</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: white; padding: 30px; border-radius: 12px; text-align: center;">
            <h2 style="margin: 0 0 20px 0;">Your Verification Code</h2>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #a7f3d0;">${otp}</div>
            </div>
            <p style="margin: 20px 0 0 0; opacity: 0.9;">This code expires in 5 minutes</p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              ${isSignUp ? 
                `Hello ${name || 'there'}! Welcome to Natural Green. Please enter this code to complete your registration.` :
                'Please enter this code to sign in to your account.'
              }
            </p>
            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
              If you didn't request this code, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>Email sent to: ${email}</p>
          </div>
        </div>
      `,
    });

    console.log("OTP email sent successfully to:", email, "Response:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "OTP sent successfully",
      email: email // Confirm which email was used
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send OTP",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
