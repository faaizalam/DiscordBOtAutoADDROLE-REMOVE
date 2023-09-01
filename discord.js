require('dotenv').config();
// const TOKEN = process.env.TOKEN;
// const GUILD_ID = process.env.GUILD_ID;
const ROLE_NAME = 'Member';
const TOKEN = "MTE0NjA4ODAyMTk0MzM5MDI0OA.GHcK4o.Q_3TC4mbVtH48WslFBrUvFhiqies9tOd_6V_2E"
const GUILD_ID = "1141724958897217608"

const discordKickOut = async (req, client) => {
    try {
        client.on('ready', async () => {
            console.log(`Logged in as ${client.user.tag}`);
            try {
                const guild = await client.guilds.cache.get(GUILD_ID);
                if (!guild) {
                    return 'guild not found'
                }
                const fetchedMember = await guild.members.fetch();
                const member = await fetchedMember.find(member => member.user.username === req.body.username);
                // const member = await guild.members.cache.find(member => member.user.username === "junaid_2001"); // this logic is for message
                if (!member) {
                    return "member not found !"
                }
                const role = await guild.roles.cache.find(role => role.name === ROLE_NAME);
                if (!role) {
                    return 'role not found'

                }
                member.roles.remove(role);
                // client.destroy();
                return 'role has been removed';

            }
            catch (e) {
                console.log(e);
                return e.message;
            }

        });
        client.login(TOKEN);
    }
    catch (e) {
        console.log(e);
        return e.message;
    }
}

const addRole = async (username, client) => {
    try {
        console.log("add role function");
        client.on('guildMemberAdd', async member => {
            console.log(`${member.user.tag} joined the server`);
            const guild = member.guild;
            console.log(guild);
            // Find the role by name
            const roleToAdd = guild.roles.cache.find(role => role.name === ROLE_NAME);
            if (!roleToAdd) {
                console.log(`Role "${ROLE_NAME}" not found`);
                return;
            }

            try {
                // Add the role to the new member
                await member.roles.add(roleToAdd);
                console.log(`Added role "${ROLE_NAME}" to ${member.user.tag}`);
                client.destroy();
                return `Added role "${ROLE_NAME}" to ${member.user.tag}`;
            } catch (error) {
                console.error(`Error adding role: ${error}`);
            }
        });
        client.login(TOKEN);
    }
    catch (e) {
        console.log(e);
        return e.message;
    }
}

module.exports = { discordKickOut, addRole };