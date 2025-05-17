const express = require('express');
const connectDB = require('./database');
const Usuario = require('./models/usuario');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, this is my API!');
});

app.post('/api/crtUsuarios', async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({message: 'El nombre es obligatorio'});
        }

        const nuevoUsuario = new Usuario({nombre});
        await nuevoUsuario.save();

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: nuevoUsuario
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear usuario' ,
            error: error.message
        }); 
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-__v');
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuarios', 
            error: error.message
        });
    }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({message: 'El nombre es obligatorio'});
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { nombre },
            { new: true, runValidators: true }
        );
        if (!usuarioActualizado) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }

        res.status(200).json({
            message: 'Usuario actualizado exitosamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
})

app.delete('/api/delUsuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }

        res.status(200).json({
            message: 'Usuario eliminado exitosamente',
            usuario: usuarioEliminado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
