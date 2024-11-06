import styles from './EditBook.module.css'; // Renomeie o arquivo CSS se necessário

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthValue } from '../../contexts/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';

const EditBook = () => {
  const { id } = useParams();
  const { document: book } = useFetchDocument('books', id); // Pega o documento específico de "books"

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [available, setAvailable] = useState(true);
  const [pages, setPages] = useState(0);

  const [formError, setFormError] = useState('');

  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { updateDocument, response } = useUpdateDocument('books');

  // Preencher o formulário com dados do livro
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setImage(book.image);
      setDescription(book.description);
      setTags(book.tags); // Presumindo que as tags já são uma string separada por vírgula
      setAvailable(book.available);
      setPages(book.pages);
    }
  }, [book]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validar URL da imagem
    try {
      new URL(image);
    } catch (error) {
      setFormError('A imagem precisa ser uma URL válida.');
      return;
    }

    // Verificar campos obrigatórios
    if (!title || !author || !image || !description || !tags || !pages) {
      setFormError('Por favor, preencha todos os campos!');
      return;
    }

    if (formError) return;

    // Atualizar o documento
    updateDocument(id, {
      title,
      author,
      image,
      description,
      tags,
      available,
      pages,
      uid: user.uid,
      createdBy: user.displayName,
    });

    // Redirecionar para a página principal
    navigate('/dashboard');
  };

  return (
    <div className={styles.edit_book}>
      <h2>Editando livro: {title}</h2>
      <p>Altere os dados do livro como desejar.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="title"
            required
            placeholder="Título do livro"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>Autor:</span>
          <input
            type="text"
            name="author"
            required
            placeholder="Autor do livro"
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
          />
        </label>
        <label>
          <span>Descrição:</span>
          <textarea
            name="description"
            required
            placeholder="Descrição do livro"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </label>
        <label>
          <span>URL da capa:</span>
          <input
            type="text"
            name="image"
            required
            placeholder="URL da capa do livro"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>
        <label>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            required
            placeholder="Tags separadas por vírgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>
        <label>
          <span>Páginas:</span>
          <input
            type="number"
            name="pages"
            required
            placeholder="Número de páginas do livro"
            onChange={(e) => setPages(e.target.value)}
            value={pages}
          />
        </label>
        <label>
          <span>Disponível:</span>
          <select
            value={available}
            onChange={(e) => setAvailable(e.target.value === 'true')}
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
        {!response.loading && <button className="btn">Editar livro!</button>}
        {response.loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {(response.error || formError) && (
          <p className="error">{response.error || formError}</p>
        )}
      </form>
    </div>
  );
};

export default EditBook;
