export const SignUpTemplet = (link: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- Main Container -->
      <tr>
        <td align="center" bgcolor="#f5f5f5" style="padding: 20px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 2px solid #000000; border-radius: 10px;">
            
            <!-- Logo Section -->
            <tr>
              <td align="center" style="padding: 40px 20px 20px 20px;">
              </td>
            </tr>
            
            <!-- Confirmation Message -->
            <tr>
              <td align="center" style="padding: 20px 30px;">
                <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Please Confirm Your Email Address</h2>
                <p style="color: #555555; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                  Thank you for registering with us! To complete your registration, please confirm your email address by clicking the button below.
                </p>
                <!-- Confirmation Button -->
                <a href="${link}" target="_blank" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-size: 16px; display: inline-block; border: 2px solid #000000;">
                  Confirm Email
                </a>
              </td>
            </tr>
            
            <!-- Footer Section -->
            <tr>
              <td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                <p style="color: #888888; font-size: 12px; margin: 0;">
                  If you did not create an account, no further action is required.
                </p>
                <p style="color: #888888; font-size: 12px; margin: 5px 0 0 0;">
                  © ${new Date().getFullYear()} WOL All rights reserved.
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
