
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const resend = new Resend("re_TjukBHdA_GQRAnMTnXvTnS3YjQjgdy2i4");

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, isSignUp, adminCode }: OTPRequest = await req.json();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiration (5 minutes)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        email,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        is_signup: isSignUp,
        name: name || null,
        admin_code: adminCode || null
      });

    if (insertError) {
      throw new Error(`Failed to store OTP: ${insertError.message}`);
    }

    // Send email with OTP - using verified sender email
    const emailResponse = await resend.emails.send({
      from: "Natural Green <suribhotlaabhishek25@gmail.com>",
      to: [email],
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
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "OTP sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
