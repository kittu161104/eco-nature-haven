
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

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find valid OTP with better error handling
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp_code', otp)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: "Database error occurred" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!otpRecord) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error marking OTP as used:', updateError);
    }

    // Handle signup or login
    if (otpRecord.is_signup) {
      // Create new user
      const { data: authData, error: signupError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: Math.random().toString(36).slice(-12), // Random password
        email_confirm: true,
        user_metadata: {
          name: otpRecord.name,
          is_admin: otpRecord.admin_code === "Natural@green"
        }
      });

      if (signupError) {
        console.error('Signup error:', signupError);
        throw new Error(`Signup failed: ${signupError.message}`);
      }

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          name: otpRecord.name,
          email: normalizedEmail,
          is_admin: otpRecord.admin_code === "Natural@green",
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      console.log('New user created successfully:', normalizedEmail);

      return new Response(JSON.stringify({ 
        success: true, 
        isAdmin: otpRecord.admin_code === "Natural@green",
        user: authData.user,
        message: "Account created successfully"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      // Find existing user and generate session
      const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(normalizedEmail);
      
      if (userError || !user) {
        console.error('User lookup error:', userError);
        return new Response(
          JSON.stringify({ error: "User not found. Please register first." }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Update admin status if admin code provided
      if (otpRecord.admin_code === "Natural@green") {
        const { error: adminUpdateError } = await supabase
          .from('profiles')
          .update({ 
            is_admin: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.user.id);

        if (adminUpdateError) {
          console.error('Admin status update error:', adminUpdateError);
        }
      }

      console.log('User login verified successfully:', normalizedEmail);

      return new Response(JSON.stringify({ 
        success: true, 
        isAdmin: otpRecord.admin_code === "Natural@green",
        user: user.user,
        message: "Login successful"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Verification failed",
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
