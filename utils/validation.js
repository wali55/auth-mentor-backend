const {z} = require("zod"); 

const registerSchema = z.object({
    email: z.string({required_error: "Email is required"}).email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(["USER", "ADMIN"]).optional()
})

const loginSchema = z.object({
    email: z.string({required_error: "Email is required"}).email({message: "Invalid email"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
})

module.exports = {registerSchema, loginSchema};