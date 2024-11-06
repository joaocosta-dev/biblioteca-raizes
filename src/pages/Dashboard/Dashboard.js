import { useState } from "react"

import { Link } from "react-router-dom";

import { useAuthValue } from "../../contexts/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { useUpdateDocument as useUpdateRentalDocument } from "../../hooks/useUpdateDocument";
import { useUpdateDocument as useUpdateBooksDocument } from "../../hooks/useUpdateDocument";


import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BasicTable from "../../components/BasicTable";
import { arrayUnion } from "firebase/firestore";

const Dashboard = () => {
  const { user } = useAuthValue();

  // Busca o usuário autenticado na tabela de usuários
  const { document: userspecific } = useFetchDocument("users", user?.uid);

  /* Depois de carregar o usuário, a variavel recebe os livros lidos
  daquele usuário ou um array vazio */
  const readedBooks = userspecific?.readedBooks || []

  // Busca todos os livros
  const { documents: books } = useFetchDocuments("books");

  //Busca todas as solitações
  const { documents: rentals } = useFetchDocuments("rental");
  //Quando a solicitação for negada o registro do pedido vai ser apagado
  const { deleteDocument } = useDeleteDocument("rental");

  const { updateDocument: updateRentalDocument } = useUpdateRentalDocument("rental")
  const { updateDocument: updateBooksDocument } = useUpdateBooksDocument("books")
  const { updateDocument: updateUsersDocument } = useUpdateBooksDocument("users")


  // Filtra de todos os livros para livros lidos
  const readedBooksfilter = books?.filter((book) => readedBooks.includes(book.id));

  // Estado para gerenciar as tabs do painel admin do dashboard
  const [value, setValue] = useState('1');

  //Funcao para fazer a alteração do estado, resultando na troca das tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Função que cria um objeto para ser usada na criação das rows da tabela 
  const createData = (rentalId, rentalStatus, bookName, requester, deadline, bookId, requesterId) => {
    return { rentalId, rentalStatus, bookName, requester, deadline, bookId, requesterId };
  }
  let rows = []

  rentals?.map(rental => {
    rows.push(createData(rental.id, rental.rentalStatus, rental.bookTitle, rental.userName, rental.returnDate, rental.bookId, rental.userId))
  });


  const handleAprov = (rental) => {
    updateRentalDocument(rental.rentalId, { rentalStatus: "reading" })
    updateBooksDocument(rental.bookId, { status: "reading" })
  }

  const handleReceive = (rental) => {
    updateUsersDocument(rental.userId, { readedBooks: arrayUnion(rental.bookId) })
    updateBooksDocument(rental.bookId, { available: true, status: "available" })
    deleteDocument(rental.rentalId)
  }

  const handleCancel = (rental) => {
    deleteDocument(rental.rentalId)
  }
  const handleSaveDateEdited = (rental) => {
    // Use the value of newDate as the updated returnDate
    updateRentalDocument(rental?.rentalId, { returnDate: rental.deadline })
      .then(() => {
        // Opcional: Você pode adicionar um feedback aqui, como um alerta de sucesso
        console.log("Data atualizada com sucesso!");
      })
      .catch((error) => {
        // Caso haja erro ao tentar atualizar o documento
        console.error("Erro ao atualizar a data:", error);
      });

  };


  return (
    user && userspecific?.isAdmin !== true ? (

      <>
        < div className="styles" >
          <h2>Área do leitor</h2>
          <p>Acompanhe suas solicitações e leituras realizadas</p>
          <h3 className="text-3xl underline">Aguardando aprovação</h3>
          {
            readedBooksfilter && readedBooksfilter.length === 0 ? (
              <div className="styles">
                <p>Não foram encontrados livros lidos</p>
              </div>
            ) : (
              <div className="styles">
                <span>Título</span>
              </div>
            )
          }

          {
            readedBooksfilter &&
            readedBooksfilter.map((book) => (
              <div className="styles" key={book.id}>
                <p>{book.title}</p>
                <div className="styles">
                  <Link to={`/books/${book.id}`} className="btn btn-outline">
                    Ver
                  </Link>
                </div>
              </div>
            ))
          }
        </div >
      </>

    ) : (
      <div className="flex justify-center">
        <Box sx={{ m: 3, width: "100%", background: "linear-gradient(45deg, #0B8C7C, #086A5D)", borderRadius: "15px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>
          <TabContext value={value} indicatorColor="primary">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="transparent" sx={{ display: "flex", gap: "20px" }}>
                <Tab label="Solicitações" value="1" sx={{
                  color: "white", borderRadius: "15px 15px 0 0",
                  '&.Mui-selected': {
                    borderBottom: "none", // Remove o border-bottom
                    outline: "none", // Remove contorno ao focar
                    backgroundColor: "black",
                    fontWeight: "bold",
                    color: "white"
                  },
                  '&:hover': { backgroundColor: '#000000b5' }
                }} />
                <Tab label="Relatórios" value="2" sx={{
                  color: "white", borderRadius: "15px 15px 0 0",
                  '&.Mui-selected': {
                    borderBottom: "none", // Remove o border-bottom
                    outline: "none", // Remove contorno ao focar
                    backgroundColor: "black",
                    fontWeight: "bold",
                    color: "white"
                  },
                  '&:hover': { backgroundColor: '#000000b5' }
                }} />

              </TabList>
            </Box>
            <TabPanel value="1">
              <BasicTable rows={rows}
                handleAprov={handleAprov}
                handleSaveDateEdited={handleSaveDateEdited}
                handleCancel={handleCancel}
                handleReceive={handleReceive} />

            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </div>
    )
  )
};

export default Dashboard;
