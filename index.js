import express from 'express';
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

const prisma = new PrismaClient()

const app = express();
app.use(express.json()); 
app.use(cors())



// ADICIONAR USER
app.post('/usuarios', async (req, res) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: req.body.email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já cadastrado!' });
        }

        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age,
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário!' });
    }
});



// LISTAR USER
app.get('/usuarios', async (req, res) => {
    try {
        const filters = {};

        if (req.query.name) filters.name = req.query.name;
        if (req.query.email) filters.email = req.query.email;
        if (req.query.age) filters.age = parseInt(req.query.age, 10);

        const users = await prisma.user.findMany({
            where: filters,
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar usuários!' });
    }
});



// EDITAR USER (UPDATE)
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { email, name, age } = req.body;
        const id = req.params.id;

        // Verifique se os dados estão corretos
        if (!email || !name || !age) {
            return res.status(400).json({ error: 'Dados inválidos!' });
        }

        // Certifique-se de que 'age' é uma string
        const ageAsString = String(age); // Convertendo para string

        // Verifique se o e-mail já está em uso
        const emailInUse = await prisma.user.findUnique({
            where: { email },
        });

        if (emailInUse && emailInUse.id !== id) {
            return res.status(400).json({ error: 'E-mail já está em uso!' });
        }

        // Atualize o usuário com o age convertido para string
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { email, name, age: ageAsString }, // Passando age como string
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário!' });
    }
});



// DELETE
app.delete('/usuarios/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      console.log("Tentando excluir usuário com ID:", userId);
  
      // Exclui o usuário
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId,  // Certifique-se de que o tipo do ID é válido (String ou ObjectId)
        },
      });
  
      // Confirma a exclusão
      res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ error: "Erro ao excluir usuário!" });
    }
});
  
  





/* 
    Criar nossa API de Usuarios
    - criar usuário
    - listar usuários 
    - editar usuários
    - deletar usuários

    MungoDB 
    - senha : w6BlyX6tYDCx3xSl
    - user: Pedro-Menezes

*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
