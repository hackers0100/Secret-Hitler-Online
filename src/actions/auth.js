import { DiscordSDK } from "@discord/embedded-app-sdk";
import { DISCORD_CLIENT_ID as clientId } from '../GlobalDefinitions';
import { authStore } from '../store/authStore';


const discordSdk = new DiscordSDK(clientId);
let isAuthenticating = false;

export async function start() {
  if (isAuthenticating) return;
  isAuthenticating = true;
  try {
    await discordSdk.ready();
    console.log("Discord SDK is ready");

    // Authorize with Discord Client
    const { code } = await discordSdk.commands.authorize({
      client_id: clientId,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: [
        "identify",
      ]
    });

    // Retrieve an access_token from your activity's server
    const response = await fetch(`https://${clientId}.discordsays.com/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      })
    });
    const { access_token } = await response.json();

    // Authenticate with Discord client (using the access_token)
    let authResponse = await discordSdk.commands.authenticate({
      access_token
    });

    if (authResponse == null) {
      throw new Error("Authenticate command failed");
    }
    const guildMember = null;
    //     const guildMember = discordSdk.guildId === null ? null : await fetch(
    //     `https://discord.com/api/users/@me/guilds/${discordSdk.guildId}/member`,
    //     {
    //         method: 'get',
    //         headers: { Authorization: `Bearer ${access_token}` },
    //     },
    // )
    //     .then((j) => j.json())
    //     .catch(() => {
    //         return null;
    //     });

    // Done with discord-specific setup

    try {
    const authState = {
        ...authResponse,
        user: {
            ...authResponse.user,
            id:
                new URLSearchParams(window.location.search).get('user_id') ??
                authResponse.user.id
        },
        guildMember
    };

        authStore.setState({
            ...authState
        });
    } catch {console.log('........')}
  } finally {
    isAuthenticating = false;
  }
}
export { discordSdk };