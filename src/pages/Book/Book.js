import styles from './Book.css';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Textarea from '@mui/joy/Textarea';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
// hooks
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useUpdateDocument as useUpdateBooksDocument } from '../../hooks/useUpdateDocument';
import { useUpdateDocument as useUpdateUsersDocument } from '../../hooks/useUpdateDocument';

import { useInsertDocument } from '../../hooks/useInsertDocument';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, forwardRef } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

import { useAuthValue } from '../../contexts/AuthContext';

import Button from '@mui/material/Button';
import { Height } from '@mui/icons-material';
import { borderRadius } from '@mui/system';
import { TextField } from '@mui/material';
import { arrayUnion, increment } from 'firebase/firestore';

const Book = () => {
  const [additionalDays, setAdditionalDays] = useState(0);
  const [stars, setStars] = useState(2);
  const [comment, setComment] = useState([])

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { id } = useParams();
  const { document: book } = useFetchDocument('books', id); // Alterado para buscar 'books'
  const { documents: users } = useFetchDocuments('users'); // Alterado para buscar 'books'

  const navigate = useNavigate();

  const { user } = useAuthValue();

  const daysUntilSunday = () => {
    const today = new Date(); // Pega a data de hoje
    const dayOfWeek = today.getDay(); // Pega o dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)

    // Se for domingo, falta 0 dias, caso contrário calcula a diferença até o próximo domingo
    const daysToSunday = (7 - dayOfWeek) % 7;

    return daysToSunday;
  };

  const { updateDocument: updateBooksDocument } = useUpdateBooksDocument('books');
  const { updateDocument: updateUsersDocument } = useUpdateUsersDocument('users');

  const { insertDocument } = useInsertDocument('rental');

  const returnDeadline = () => {
    const today = new Date();
    today.setDate(
      today.getDate() +
      daysUntilSunday() +
      Math.round(book.pages / 10) +
      additionalDays
    );
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses em JavaScript são de 0-11
    const year = today.getFullYear();
    const deadlineFormatted = `${day}/${month}/${year}`;

    return deadlineFormatted;
  };

  const handleLocate = (e) => {
    //Verifica se o usuários está logado para fazer a locação do livro
    if (user !== null) {
      localStorage.setItem('navHome', 'true');
      e.preventDefault();

      const rentalData = {
        bookId: id,
        userId: user.uid,
        userName: user.displayName,
        bookTitle: book.title,
        returnDate: returnDeadline(),
      };

      insertDocument(rentalData);
      updateBooksDocument(id, { available: false, status: 'waitingAprov' });
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const handleAddDays = (p) => {
    setAdditionalDays(p);
  };

  const handleOpenReview = (event) => {

    if (event != undefined) {
      setStars(event)
      setOpen(!open)
    }
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: '#665230',
    borderRadius: '18px',
    boxShadow: 24,
    p: 5,
  };

  const handleSubmit = (e, comentario) => {
    e.preventDefault();

    const data = {
        comment: comentario,
        userId: user.uid,
        userName: user.displayName,
        bookId: id,
        stars: stars,
    };

    // Atualiza o Firestore
    updateUsersDocument(user?.uid, { userAvaliation: increment(1) });
    updateBooksDocument(id, { comments: arrayUnion(data) });

    // Atualiza o estado local com o novo comentário (sem precisar refazer a consulta)
    setComment((prevComments) => [...prevComments, data]);

    // Fecha o modal
    setOpen(false);
};


  return (
    <>

      <div className="book-container container flex justify-around py-14">
        <div className="left-content">
          {book && (
            <>
              <div className="author mb-6 p-2">
                <h1 className="font-bold text-3xl ms-1">{book.title}</h1>{' '}
                {/* Título do livro */}
                <h2 className="font-medium text-2xl ms-1">{book.author}</h2>{' '}
                {/* Autor do livro */}
              </div>
              <p className="max-w-[550px] text-xl font-medium mb-6">
                {book.description}
              </p>
              {/* Descrição do livro */}
              <h3 className="text-lg mb-1">Tags deste livro:</h3>
              <div className="box-tag-book mb-8">
                {book.tags.split(',').map((tag) => (
                  <p className="tag-book" key={tag}>
                    {tag}
                  </p>
                ))}
              </div>

              <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center" }} spacing={2}>
                <Rating sx={{ ".MuiRating-iconFilled": { color: "#032924" }, ".MuiRating-iconEmpty": { color: "black" } }} name="size-large" size='large' defaultValue={2} onChange={(event) => { handleOpenReview(event.target.defaultValue) }} />

                <p style={{ margin: "0 15px" }}>({book?.comments?.length == null ? 0 : book?.comments?.length}) Avaliações</p>

                <div>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography mb="32px" fontFamily="Roboto" color='#E4E5EC' id="modal-modal-title" variant="h5" component="h4">
                        Avaliar livro
                      </Typography>
                      <Box className="flex">
                        <Box><img className='rounded-md' src={book.image} width={137} height={176} /> </Box>
                        <Box sx={{ marginLeft: "46px" }}>
                          <Typography mb="12px" fontFamily="Roboto" color='#E4E5EC' id="modal-modal-title" variant="h4" component="h2">
                            {book.title}
                          </Typography>
                          <p className='text-white mb-4'>Categoria(s):  {book.tags.split(',').map((tag) => (
                            tag
                          ))}
                          </p>
                          <p className='text-white mb-2'>Sua avaliação: </p>
                          <p>
                            <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center" }} spacing={2}>
                              <Rating sx={{ ".MuiRating-iconFilled": { color: "#032924" } }} name="size-large" size='large' defaultValue={stars} />
                            </Stack>
                          </p>
                        </Box>

                      </Box>
                      <Box component="form"
                        onSubmit={(e) => { handleSubmit(e, comment) }}
                        sx={{
                          mt: 4,
                          borderRadius: '15px',
                        }}>
                        <Textarea
                          variant="solid"
                          required
                          margin="normal"
                          placeholder="Deixe aqui sua avaliação"
                          onChange={(e) => setComment(e.target.value)}
                          value={comment} sx={{
                            height: "200px",
                            background: "grey",
                            '--Textarea-focusedThickness': '0rem',
                            '--Textarea-focusedHighlight': '0 4px 10px rgba(0, 0, 0, 1)',
                            '&::before': {
                              transition: 'box-shadow .15s ease-in-out',
                            },
                            '&:focus-within': {
                              borderColor: '#892CCD',
                            }
                          }}
                        />
                        <div className='flex justify-end'>
                          <Button
                            variant="outlined"
                            type="submit"
                            sx={{
                              mt: 3,
                              fontSize: '14px',
                              borderRadius: '10px',
                              color: '#FFF',
                              background: '#000',
                              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                              border: "none",
                              ':hover': { background: '#303030', color: '#FFF' }
                            }}
                          >
                            Avaliar
                          </Button>

                        </div>
                      </Box>
                    </Box>
                  </Modal>
                </div>

              </Stack>

              <p className="mb-3 mt-4">
                <strong>Disponível:</strong> {book.available ? 'Sim' : 'Não'}{' '}
                {/* Disponibilidade */}
              </p>

              {/* <p>
              <strong>Criado por:</strong> {book.createdBy}  Usuário que criou 
            </p> */}
              {book.available === true && (
                <>
                  <p className="text-lg font-medium mb-3">
                    O prazo de devolução começa a partir da retirada no próximo
                    domingo<br></br> O livro precisa ser devolvido em:{' '}
                    {returnDeadline()}
                  </p>
                  <Button
                    sx={{ backgroundColor: 'black' }}
                    variant="contained"
                    className="w-full"
                    onClick={handleLocate}
                  >
                    Locar
                  </Button>

                </>
              )}
              {book.available === false && (
                <>
                  {/* <p>Voce tem até dia {returnDeadline()} para devolução do livro<br />
                  Gostaria de solicitar mais {Math.round(book.pages / 20)} dia(s)?</p> */}
                  <Button
                    sx={{ backgroundColor: 'black' }}
                    variant="contained"
                    className="w-full"
                    onClick={() => handleAddDays(Math.round(book.pages / 20))}
                  >
                    Solicitar
                  </Button>
                </>
              )}
            </>
          )}
        </div>
        <div className="right-content">
          {book && <img src={book.image} alt={book.title} />}
        </div>
      </div>
      <div className='flex justify-center'>


        <Box sx={{
          width: '78%',
          borderRadius: '15px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          boxShadow: '',
          flexDirection: "column"
        }}>
          <div className='flex justify-between mb-4'>
            <Typography className="flex" variant='h4' color='white'> Avaliações </Typography>

            <Button sx={{ color: "white", ":hover": { background: "grey" } }} className='flex'> <StarBorderTwoToneIcon className='mr-2' />Avaliar Livro</Button>
          </div>
          {book && book.comments?.length !== 0 && (
            book.comments?.map((comment) => (
              <div className='flex justify-between bg-zinc-700 rounded-xl min-h-40 mb-4 p-4' style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>

                <div className='w-1/6'>
                  <p className='text-xl text-white font-bold'> {comment.userName} </p>
                  <p className='text-lg text-gray-400'>
                    {users?.map((us) => {
                      // Verifica se o usuário atual é igual ao user.uid
                      if (us.id === comment.userId) {
                        return <span className='mr-1'>({us.userAvaliation})</span>; // Retorna a avaliação do usuário se a condição for verdadeira
                      }
                      return null; // Retorna null se a condição não for atendida
                    })}
                    avaliações
                  </p>
                </div>
                <div className='w-4/6'>
                  <p className='text-white text-lg '>{comment.comment}</p>

                </div>
                <div className='w-1/6'>
                  <p >{comment.stars}/5</p>

                </div>

              </div>
            ))
          )}
        </Box>
      </div>
    </>
  );
};

export default Book;
