import styles from "./CreateBook.module.css"; // Renomeie o arquivo CSS se necessário

import { useState } from "react";
import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../contexts/AuthContext";
import { TextField, Button, Typography, Box } from '@mui/material';

const CreateBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(""); // Novo campo para autor
  const [image, setImage] = useState("");
  const [description, setDescription] = useState(""); // Novo campo para descrição
  const [tags, setTags] = useState("");
  const [available, setAvailable] = useState(true);
  const [pages, setPages] = useState(0);
  const [status, setStatus] = useState("")

  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { insertDocument, response } = useInsertDocument("books"); // Atualize o nome da coleção

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Validate image URL
    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL.");
    }

    // Create tags array
    // const tagsArray = tags.replace(/#/g, '').split(",");

    // Check values
    if (!title || !author || !image || !description || !tags || !pages) {
      setFormError("Por favor, preencha todos os campos!");
      return;
    }

    if (formError) return;

    insertDocument({
      title,
      author,
      image,
      description,
      tags,
      available,
      pages,
      uid: user.uid,
      createdBy: user.displayName,
      status
    });

    // Redirect to home page
    navigate("/");
  };

  return (

    <div className="flex justify-center">

      <Box sx={{ m: 3, width: "100%", background: "linear-gradient(45deg, #0B8C7C, #086A5D);", borderRadius: "15px", padding: "20px", display: "flex", justifyContent: "space-between", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>
        <Box sx={{ m: 4, width: "65ch", display: "flex", justifyContent: "center", flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF' }}>Enriqueça sua biblioteca adicionando os seus livros disponiveis para locação</Typography>
          <ul>
            <p className="text-xl mt-14 mb-4 text-white">Observações para inserção:</p>
            <li className="list-disc text-lg text-white ml-5 mb-2 font-bold">Todos os campos devem ser preenchidos para conseguir criar um livro.</li>
            <li className="list-disc text-lg text-white ml-5 mb-2 font-bold">A URL da capa deve ser uma imagem cheia do livro.</li>
            <li className="list-disc text-lg text-white ml-5 mb-2 font-bold">As tags devem ser inseridas com o formato <code>#tag</code> e separadas por vírgula caso tenha mais de uma.</li>
            <li className="list-disc text-lg text-white ml-5 mb-2 font-bold">As categorias dos livros serão criadas de acordo com as tags. Exemplo de inserção: <code>#Autocuidado, #Estudos</code>.</li>
          </ul>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ m: 4, width: "60ch", background: "linear-gradient(225deg, #000000, #333333)", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)", borderRadius: "15px", padding: "20px" }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF' }}>Criar livro</Typography>
          <Typography variant="body1" sx={{ color: '#FFFFFF' }}>Adicione um novo livro à sua biblioteca!</Typography>

          <TextField
            label="Título"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            placeholder="Título do livro"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFFFFF', // Cor da borda
                },
                '&:hover fieldset': {
                  borderColor: '#FFFFFF', // Cor da borda ao passar o mouse
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFFFFF', // Cor da borda ao focar
                },
                color: '#FFFFFF', // Cor do texto
                backgroundColor: 'transparent', // Fundo transparente
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF', // Cor do label
                '&.Mui-focused': {
                  color: '#FFFFFF', // Cor do label ao focar
                },
              },
            }}
          />
          <TextField
            label="Autor"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            placeholder="Autor do livro"
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&:hover fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFFFFF',
                },
                color: '#FFFFFF',
                backgroundColor: 'transparent',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF',
                },
              },
            }}
          />
          <TextField
            label="Descrição"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            placeholder="Descrição do livro"
            multiline
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&:hover fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFFFFF',
                },
                color: '#FFFFFF',
                backgroundColor: 'transparent',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF',
                },
              },
            }}
          />
          <TextField
            label="URL da capa"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            placeholder="URL da capa do livro"
            onChange={(e) => setImage(e.target.value)}
            value={image}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&:hover fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFFFFF',
                },
                color: '#FFFFFF',
                backgroundColor: 'transparent',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF',
                },
              },
            }}
          />
          <TextField
            label="Tags"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            placeholder="Tags separadas por vírgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&:hover fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFFFFF',
                },
                color: '#FFFFFF',
                backgroundColor: 'transparent',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF',
                },
              },
            }}
          />
          <TextField
            label="Páginas"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            placeholder="Número de páginas do livro"
            type="number"
            onChange={(e) => setPages(e.target.value)}
            value={pages}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&:hover fieldset': {
                  borderColor: '#FFFFFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFFFFF',
                },
                color: '#FFFFFF',
                backgroundColor: 'transparent',
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF',
                },
              },
            }}
          />
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2,fontSize:'16px',padding:'12px',borderRadius:'10px', color: '#FFF', background: '#0B8C7C', ":hover": { background: '#086A5D' } }} // Cor do botão
              disabled={response.loading}
            >
              {response.loading ? 'Aguarde...' : 'Criar livro'}
            </Button>
          </div>


          {(response.error || formError) && (
            <Typography color="error" sx={{ mt: 2 }}>
              {response.error || formError}
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default CreateBook;
