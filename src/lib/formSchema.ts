import { z } from "zod"

export const formSchema = z.object({
    username: z.string().min(2, {message: "ユーザー名は2文字以上にしてください。"}),
    image: z.string(),
    hashedPassword: z.string().min(5, {message: "パスワードは5文字以上にしてください。"}),
    email: z.string().email({message: "適切なメールアドレスを入力してください。"})

})