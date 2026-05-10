// Você PRECISA importar o z do zod
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(3, 'Email obrigatyior'),
  email: z.string().min(3,'Email inválido'),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres')
});

// O TypeScript infere o tipo FormData a partir do schema
type FormData = z.infer<typeof schema>;