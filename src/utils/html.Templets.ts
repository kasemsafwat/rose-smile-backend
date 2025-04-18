const SignUpTemplet = (link: string) => `<!DOCTYPE html>
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

const welcome = () => {
  return `
   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mohamed Hamed Portfolio</title>
    <link
      rel="icon"
      href="path_to_your_image/favicon.ico"
      type="image/x-icon"
    />
    <!-- Add image for tab icon -->
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #333;
        color: #fff;
        transition: background-color 0.3s, color 0.3s;
      }
      .light-mode {
        background-color: #f4f4f4;
        color: #333;
      }
      .container {
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
        background-color: #444;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      .content h4 {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
      }
      .content p,
      h2 {
        font-size: 16px;
        margin-bottom: 10px;
        text-align: center;
      }
      .link-container a {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 12px;
        text-align: center;
        transition: background-color 0.3s, color 0.3s;
      }
      .link-container a:hover {
        background-color: #0056b3;
      }
      .social-icons a {
        display: inline-block;
        margin: 5px;
        font-size: 14px;
        color: #fff;
        background-color: #4caf50;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
      }
      .social-icons a:hover {
        background-color: #45a049;
      }
      iframe {
        width: 100%;
        height: 400px;
        margin-bottom: 20px;
        border-radius: 10px;
        border: none;
      }
      img {
        max-width: 200px;
        border-radius: 10px;
        display: block;
        margin: 20px auto;
      }
      .toggle-button {
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #555;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .toggle-button:hover {
        background-color: #333;
      }
    </style>
  </head>
  <body>
    <button class="toggle-button" onclick="toggleMode()">
      Toggle Light/Dark Mode
    </button>
    <div id="MainContent" class="container">
      <!-- Video Section -->

      <iframe
        id="MainContent"
        src="${process.env.ProjectVideo}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>

      <!-- Main Content -->
      <h4 style="text-align: center; color: #fff">
        Welcome to My API Services
      </h4>
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-radius: 10px;
        "
        id="MainContent"
        class="content"
      >
        <!-- الصورة -->
        <img
          src="${process.env.profileImg}"
          alt="Mohamed Hamed"
          style="max-width: 270px; max-height: 100%; border-radius: 10px"
        />


        <div style="flex: 1; margin-left: 20px">
          <div
            class="link-container"
            style="
              margin-bottom: 15px;
              text-align: left;
              display: flex;
              flex-direction: column;
              gap: 10px;
            "
          >
            <!-- Documentation -->
            <div style="text-align: center; margin-top: 50px">
              <p
                style="
                  margin-right: 15px;
                  font-size: 14px;
                  color: #f4f4f4;
                  display: inline-block;
                "
              >
                API Documentation
              </p>
              <a
                href="${process.env.Apidoc}"
                target="_blank"
                style="background-color: #28a745"
                >View Documentation
              </a>
            </div>

            <!-- GitHub -->
            <div style="text-align: center">
              <p
                style="
                  display: inline-block;
                  margin-right: 15px;
                  font-size: 14px;
                  color: #f4f4f4;
                  display: inline-block;
                "
              >
                GitHub Repository
              </p>
              <a
                href="${process.env.ProjectOnGithub}"
                target="_blank"
                style="
                  background-color: #007bff;
                  color: #fff;
                  text-decoration: none;
                "
                >View on GitHub
              </a>
            </div>

            <!-- Live Project -->
            <div style="text-align: center">
              <p
                style="
                  margin-right: 15px;
                  display: inline-block;
                  font-size: 14px;
                  color: #f4f4f4;
                "
              >
                view Live Project
              </p>
              <a
                href="${process.env.LiveServer}"
                target="_blank"
                style="background-color: #dc3545"
                >View Live frontend</a
              >
            </div>
          </div>

          <h2 style="text-align: center">${process.env.Myname}</h2>
          <p style="text-align: center">Title: Backend Node.js Developer</p>
          <p style="text-align: center">Email: ${process.env.useremail}</p>
          <p style="text-align: center">Location: ${process.env.location}</p>
          <div class="social-icons" style="text-align: center">
            <a href="${process.env.GitHub}" target="_blank">GitHub</a>
            <a href="${process.env.linkedIn}" target="_blank">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleMode() {
        document.body.classList.toggle("light-mode");
        document.getElementById("MainContent").classList.toggle("light-mode");
        document.getElementById("MainContent").style.color = "#fff";
      }
    </script>
  </body>
</html>`;
};

class HtmlTemplets {
  constructor(private link: string) {}

  signUp() {
    return SignUpTemplet(this.link);
  }

  welcome() {
    return welcome();
  }
}
