import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";
import bcrypt from "bcrypt";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(
    session({
        secret: "cp_tracker_secret",
        resave: false,
        saveUninitialized: false
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"index.html"));
});
app.get("/dashboard", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login");
    }
    res.sendFile(
        path.join(__dirname,"Pages","dashboard.html")
    );
});
app.get("/goals", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login");
    }
    res.sendFile(
        path.join(__dirname,"Pages","goals.html")
    );
});
app.get("/contests", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login");
    }
    res.sendFile(
        path.join(
            __dirname,
            "Pages",
            "contests.html"
        )
    );
});
app.get("/resources", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login");
    }
    res.sendFile(path.join(__dirname,"Pages","resources.html"));
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"Pages","about.html"));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "Pages", "signup.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "Pages", "login.html"));
});
app.get("/profile", (req, res) => {
    if(!req.session.user){
        return res.redirect("/login");
    }
    res.sendFile(
        path.join(
            __dirname,
            "Pages",
            "profile.html"
        )
    );
});
app.post("/api/goals", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    const { goalText } = req.body;
    try{
        const result = await db.query(
            `
            INSERT INTO goals
            (user_id, goal_text)
            VALUES($1,$2)
            RETURNING *
            `,
            [req.session.user.id, goalText]
        );
        res.json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            error: "Server Error"
        });
    }
});
app.get("/api/goals", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    try{
        const result = await db.query(
            `
            SELECT *
            FROM goals
            WHERE user_id = $1
            ORDER BY id
            `,
            [req.session.user.id]
        );
        res.json(result.rows);
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            error: "Server Error"
        });
    }

});
app.delete("/api/goals/:id", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    try{
        await db.query(
          `
            DELETE FROM goals
            WHERE id = $1
            AND user_id = $2
            `,
            [
                req.params.id,
                req.session.user.id
            ]
        );
        res.json({
            success: true
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            error: "Server Error"
        });
    }

});
app.put("/api/goals/:id", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    const { completed } = req.body;
    try{
        await db.query(
            `
            UPDATE goals
            SET completed = $1
            WHERE id = $2
            AND user_id = $3
            `,
            [
                completed,
                req.params.id,
                req.session.user.id
            ]
        );
        res.json({
            success: true
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            error: "Server Error"
        });

    }

});
app.get("/api/dashboard", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    try{
        const totalGoalsResult =
            await db.query(
                `
                SELECT COUNT(*) AS total
                FROM goals
                WHERE user_id = $1
                `,
                [req.session.user.id]
            );

        const completedGoalsResult =
            await db.query(
                `
                SELECT COUNT(*) AS completed
                FROM goals
                WHERE user_id = $1
                AND completed = true
                `,
                [req.session.user.id]
            );

        const totalGoals =
            Number(
                totalGoalsResult.rows[0].total
            );

        const completedGoals =
            Number(
                completedGoalsResult.rows[0].completed
            );

        const activeGoals =
            totalGoals - completedGoals;

        const completionPercentage =
            totalGoals === 0
            ? 0
            : Math.round(
                completedGoals * 100 / totalGoals
            );

        const recentGoalsResult =await db.query(
        `
        SELECT goal_text
        FROM goals
        WHERE user_id = $1
        AND completed = true
        ORDER BY id DESC
        LIMIT 5
        `,
        [req.session.user.id]
    );

        res.json({
            totalGoals,
            completedGoals,
            activeGoals,
            completionPercentage,
            recentGoals:
                recentGoalsResult.rows
        });

        }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

});
app.get("/api/cf-handle", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    try{
        const result = await db.query(
            `
            SELECT cf_handle
            FROM users
            WHERE id = $1
            `,
            [req.session.user.id]
        );

        res.json({
            cf_handle:
                result.rows[0].cf_handle
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

});

app.post("/api/cf-handle", async (req, res) => {

    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const { cfHandle } = req.body;

    try{

        await db.query(
            `
            UPDATE users
            SET cf_handle = $1
            WHERE id = $2
            `,
            [
                cfHandle,
                req.session.user.id
            ]
        );

        res.json({
            success: true
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

    
});
app.get("/api/leetcode-handle", async (req, res) => {

    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    try{

        const result = await db.query(
            `
            SELECT leetcode_handle
            FROM users
            WHERE id = $1
            `,
            [req.session.user.id]
        );

        res.json({
            leetcode_handle:
                result.rows[0].leetcode_handle
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

});

app.post("/api/leetcode-handle", async (req, res) => {

    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const { leetcodeHandle } = req.body;

    try{

        await db.query(
            `
            UPDATE users
            SET leetcode_handle = $1
            WHERE id = $2
            `,
            [
                leetcodeHandle,
                req.session.user.id
            ]
        );

        res.json({
            success: true
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

});
app.get("/api/user", (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    res.json({
        name: req.session.user.name,
        email: req.session.user.email
    });

});
app.post("/api/contests/save", async (req, res) => {

    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const {
        contest_name,
        platform,
        contest_link,
        contest_time
    } = req.body;

    try{

        await db.query(
            `
            INSERT INTO saved_contests
            (
                user_id,
                contest_name,
                platform,
                contest_link,
                contest_time
            )
            VALUES($1,$2,$3,$4,$5)
            `,
            [
                req.session.user.id,
                contest_name,
                platform,
                contest_link,
                contest_time
            ]
        );

        res.json({
            success: true
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

});
app.get("/api/contests/saved", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    try{
        const result =
            await db.query(
                `
                SELECT *
                FROM saved_contests
                WHERE user_id = $1
                ORDER BY contest_time
                `,
                [req.session.user.id]
            );
        res.json(
            result.rows
        );

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

});
app.delete(
    "/api/contests/:id",
    async (req, res) => {

        if(!req.session.user){
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        try{

            await db.query(
                `
                DELETE FROM saved_contests
                WHERE id = $1
                AND user_id = $2
                `,
                [
                    req.params.id,
                    req.session.user.id
                ]
            );

            res.json({
                success: true
            });

        }
        catch(error){

            console.log(error);

            res.status(500).json({
                error: "Server Error"
            });

        }

    }
);
app.post("/signup", async (req, res) => {
    const {
        name,
        email,
        password,
        confirmPassword
    } = req.body;
    if(password !== confirmPassword){
        return res.send(
            "Passwords do not match"
        );

    }
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return res.send(
            "Invalid email format"
        );

    }
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if(!passwordRegex.test(password)){
        return res.send(
            "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number"
        );
    }
    try{
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        await db.query(
            `
            INSERT INTO users
            (name,email,password)
            VALUES($1,$2,$3)
            `,
            [
                name,
                email,
                hashedPassword
            ]
        );

        res.redirect("/login");

    }
    catch(error){

        console.log(error);

        res.send(
            "User already exists"
        );

    }

});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        );
        if(result.rows.length === 0){
            return res.send(
                "User not found"
            );
        }
        const user = result.rows[0];
        const validPassword =
        await bcrypt.compare(
            password,
            user.password
        );
        if(!validPassword){
            return res.send(
                "Incorrect password"
            );
        }
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        res.redirect("/dashboard");
    }
    catch(error){
        console.log(error);
        res.send(
            "Something went wrong"
        );
    }

});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });

});

app.get(
    "/api/profile",
    async (req, res) => {

        if(!req.session.user){
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        try{

            const userResult =
                await db.query(
                    `
                    SELECT
                    name,
                    email,
                    cf_handle,
                    leetcode_handle
                    FROM users
                    WHERE id = $1
                    `,
                    [
                        req.session.user.id
                    ]
                );

            const completedGoals =
                await db.query(
                    `
                    SELECT COUNT(*)
                    FROM goals
                    WHERE user_id = $1
                    AND completed = true
                    `,
                    [
                        req.session.user.id
                    ]
                );

            const activeGoals =
                await db.query(
                    `
                    SELECT COUNT(*)
                    FROM goals
                    WHERE user_id = $1
                    AND completed = false
                    `,
                    [
                        req.session.user.id
                    ]
                );

            const contests =
                await db.query(
                    `
                    SELECT COUNT(*)
                    FROM saved_contests
                    WHERE user_id = $1
                    `,
                    [
                        req.session.user.id
                    ]
                );

            res.json({

                ...userResult.rows[0],

                completedGoals:
                    completedGoals
                    .rows[0]
                    .count,

                activeGoals:
                    activeGoals
                    .rows[0]
                    .count,

                savedContests:
                    contests
                    .rows[0]
                    .count

            });

        }
        catch(error){

            console.log(error);

            res.status(500).json({
                error:
                "Server Error"
            });

        }

    }
);
app.get("/api/auth-status", (req, res) => {
    res.json({
        loggedIn: !!req.session.user
    });

});
app.put(
    "/api/profile",
    async (req, res) => {

        if(!req.session.user){

            return res.status(401).json({
                error: "Unauthorized"
            });

        }

        const {
            name,
            email
        } = req.body;

        try{

            await db.query(
                `
                UPDATE users
                SET
                name = $1,
                email = $2
                WHERE id = $3
                `,
                [
                    name,
                    email,
                    req.session.user.id
                ]
            );

            req.session.user.name =
                name;

            req.session.user.email =
                email;

            res.json({
                success:true
            });

        }
        catch(error){

            console.log(error);

            res.status(500).json({
                error:"Server Error"
            });

        }

    }
);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});