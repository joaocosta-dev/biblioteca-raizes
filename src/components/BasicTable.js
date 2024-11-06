import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import BookmarkAddedTwoToneIcon from '@mui/icons-material/BookmarkAddedTwoTone';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';  // Para o campo de input
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';

import { useUpdateDocument } from '../hooks/useUpdateDocument';



export default function BasicTable({ rows, handleAprov, handleCancel, handleReceive }) {

    const [editingRow, setEditingRow] = React.useState(null);  // Estado para controlar qual linha está sendo editada
    const [newDate, setNewDate] = React.useState("");  // Estado para armazenar a nova data
    const { updateDocument } = useUpdateDocument("rental")

    // Função chamada quando o botão de salvar é clicado
    const handleSaveDate = (row) => {
        updateDocument(row.rentalId, { returnDate: newDate });  // Função que você vai passar para atualizar o Firestore

        // Após salvar, voltar a visualização e limpar o campo de data
        setEditingRow(null);
        setNewDate('');
    };

    // Função para editar a data
    const handleEditDate = (row) => {
        setEditingRow(row.rentalId);  // Inicia a edição da linha
        setNewDate(row.deadline);  // Preenche o campo de data com o valor atual
    };

    return (
        <TableContainer sx={{ backgroundColor: "lightgray", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }} component={Paper}>
            <Table sx={{}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Livro</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Solicitante</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Prazo de entrega</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>Operações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows
                        .sort((a, b) => {
                            const parseDate = (dateString) => {
                                const [day, month, year] = dateString.split('/');
                                return new Date(`${month}/${day}/${year}`);  // Formato MM/DD/YYYY
                            };

                            const dateA = parseDate(a.deadline);
                            const dateB = parseDate(b.deadline);

                            return dateA - dateB;  // crescente
                        })
                        .map((row, index) => (
                            <TableRow
                                key={row.rentalId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell key={`book-${index}`} component="th" scope="row">
                                    {row.bookName}
                                </TableCell>
                                <TableCell key={`requester-${index}`} align="right">{row.requester}</TableCell>
                                <TableCell key={`operations-${index}`} align="right">
                                    {/* Verifica se é a linha que está sendo editada */}
                                    {editingRow === row.rentalId ? (
                                        <TextField
                                            type="text"
                                            value={newDate}  // O valor do campo de data está atrelado ao estado newDate
                                            onChange={(e) => setNewDate(e.target.value)}  // Atualiza o estado com a nova data
                                            sx={{ width: 110 }}
                                        />
                                    ) : (
                                        row.deadline
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <ButtonGroup size='medium' variant="contained" aria-label="Large button group">
                                        {row.rentalStatus !== "reading" ? (
                                            <>
                                                <Tooltip title="Aprovar locação">
                                                    <Button color="success" onClick={() => { handleAprov(row) }} ><CheckCircleTwoToneIcon /> </Button>
                                                </Tooltip>
                                                <Tooltip title="Reprovar locação">
                                                    <Button color="error" onClick={() => { handleCancel(row) }}><HighlightOffTwoToneIcon /> </Button>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title="Confirmar devolução">
                                                    <Button color="success" onClick={() => { handleReceive(row) }}><BookmarkAddedTwoToneIcon /></Button>
                                                </Tooltip>
                                                {editingRow !== row.rentalId ? (
                                                    <Tooltip title="Editar prazo de entrega">
                                                        <Button color="primary" onClick={() => handleEditDate(row)}><EditCalendarTwoToneIcon /></Button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Salvar alteração">
                                                        <Button color="success" onClick={() => handleSaveDate(row)}>
                                                            <EventAvailableTwoToneIcon />
                                                        </Button>
                                                    </Tooltip>

                                                )}
                                            </>
                                        )}
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}