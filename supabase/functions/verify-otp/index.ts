
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp }: VerifyOTPRequest = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find valid OTP
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as used
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otpRecord.id);

    // Handle signup or login
    if (otpRecord.is_signup) {
      // Create new user
      const { data: authData, error: signupError } = await supabase.auth.admin.createUser({
        email: email,
        password: Math.random().toString(36).slice(-12), // Random password
        email_confirm: true,
        user_metadata: {
          name: otpRecord.name,
          is_admin: otpRecord.admin_code === "Natural@green"
        }
      });

      if (signupError) {
        throw new Error(`Signup failed: ${signupError.message}`);
      }

      // Update profile with admin status if needed
      if (otpRecord.admin_code === "Natural@green") {
        await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', authData.user.id);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        isAdmin: otpRecord.admin_code === "Natural@green",
        user: authData.user 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      // Find existing user and generate session
      const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Update admin status if admin code provided
      if (otpRecord.admin_code === "Natural@green") {
        await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', user.user.id);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        isAdmin: otpRecord.admin_code === "Natural@green",
        user: user.user 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
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
