const express = require("express");
const app = express();
// This is your test secret API key.
const PORT = 9090;
const cors = require("cors");
const useravailiblitylimit = require("./stripe");
const { discordKickOut, addRole } = require("./discord");
const { Client, IntentsBitField, Role } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages, //for messages
        IntentsBitField.Flags.MessageContent, //for messages
    ]
});
const TOKEN = "MTE0NjA4ODAyMTk0MzM5MDI0OA.GHcK4o.Q_3TC4mbVtH48WslFBrUvFhiqies9tOd_6V_2E"



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
        // client.destroy();
        return `Added role "${ROLE_NAME}" to ${member.user.tag}`;
    } catch (error) {
        console.error(`Error adding role: ${error}`);
    }
});
client.login(TOKEN);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "*"
}))

app.get("/", (req, res) => {
    res.send("hello world")
})

app.post("/payment-status", async (req, res) => {
    console.log("request body", req.body);
    try {
        const paymentStatus = await useravailiblitylimit(req, res);
        res.send({
            errMsg: null,
            response: paymentStatus
        })
    }
    catch (e) {
        res.status(500).send({
            errMsg: e.message,
            response: "internal server error"
        });
    }
})

app.post("/kickout", async (req, res) => {
    console.log("request body", req.body);
    try {
        const discordResponse = await discordKickOut(req, client);
        res.send({
            errMsg: null,
            response: discordResponse
        })
    }
    catch (e) {
        res.status(500).send({
            errMsg: e.message,
            response: "internal server error"
        });
    }
});

app.post("/addmember", async (req, res) => {
    if (req.body.wix) {
        try {
            const response = await addRole(req.body.username, client);
            res.send({
                errMsg: null,
                response: response
            })
        }
        catch (e) {
            res.status(500).send({
                errMsg: e.message,
                response: "internal server error"
            });
        }
    }
    else {
        res.status(403).send({
            errMsg: "not allowed",
            response: "request is not from wix"
        })
    }

})

app.listen(PORT, () => {
    console.log(`your server is listening at https://localhost:${PORT}`);
})