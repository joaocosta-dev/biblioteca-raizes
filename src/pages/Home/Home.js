import styles from "./Home.css";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BookDetail from "../../components/BookDetail";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Home = () => {
  const { documents: books = [], loading } = useFetchDocuments("books");
  const [query, setQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Função de filtro
  useEffect(() => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = books.filter(book => {
        const tags = book.tags.replace(/#/g, '').split(',').map(tag => tag.trim());
        return (
          book.title.toLowerCase().includes(lowerCaseQuery) ||
          tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
      });
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  }, [query, books]);

  // Geração de tags únicas
  let a = [];
  books.forEach((book) => {
    const tags = book.tags.replace(/#/g, '').split(',');
    a.push(...tags);
  });
  a = [...new Set(a.map(tag => tag.trim()))]; // Remove duplicatas e espaços

  return (

    <div className="home">

      <Box component="form"
        sx={{ '& > :not(style)': { m: 1, width: '100%', maxWidth:'475px' } }}
        noValidate
        autoComplete="off">
        <TextField id="outlined-basic"
          label="Qual livro ou tema você está procurando?"
          variant="outlined"
          onChange={(e) => setQuery(e.target.value)}
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
              // backgroundColor: '#FFFFFF', // Cor do fundo
            },
          }}
          InputLabelProps={{
            sx: {
              color: '#FFFFFF', // Cor do label
              '&.Mui-focused': {
                color: '#FFFFFF', // Cor do label ao focar
              },
            },
          }}
        />
      </Box>


      <div className="books_container">
        {loading && <p>Carregando...</p>}
        {books.length === 0 && !loading && (
          <div className="nobooks">
            <p>Não foram encontrados livros</p>
            <Link to="/books/create" className="btn">Criar primeiro livro</Link>
          </div>
        )}

        {query && filteredBooks.length === 0 && (
          <p>Nenhum item encontrado</p>
        )}

        <ul>
          {a.map((tag, index) => {
            // Filtra livros para a tag atual, dependendo se a busca está ativa ou não
            const booksForTag = query
              ? filteredBooks.filter(book => {
                const bookTags = book.tags.replace(/#/g, '').split(',').map(tag => tag.trim());
                return bookTags.includes(tag);
              })
              : books.filter(book => {
                const bookTags = book.tags.replace(/#/g, '').split(',').map(tag => tag.trim());
                return bookTags.includes(tag);
              });

            return (
              booksForTag.length > 0 && (
                <li className="mb-5" key={index}>
                  <h2 className="text-white font-bold text-2xl mb-3">{tag}</h2>
                  <div className="books_list">
                    {booksForTag.map((book) => (
                      <Link key={book.id} to={`/books/${book.id}`} className="fit_content">
                        <BookDetail book={book} />
                      </Link>
                    ))}
                  </div>
                </li>
              )
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;