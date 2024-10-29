import styles from "./CreateBook.module.css"; // Renomeie o arquivo CSS se necessário

import { useState } from "react";
import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../contexts/AuthContext";

const CreateBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(""); // Novo campo para autor
  const [image, setImage] = useState("");
  const [description, setDescription] = useState(""); // Novo campo para descrição
  const [tags, setTags] = useState("");
  const [available, setAvailable] = useState(true);
  const [pages, setPages] = useState(0);

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
    });

    // Redirect to home page
    navigate("/");
  };

  return (
    <div className={styles.create_book}>
      <h2>Criar livro</h2>
      <p>Adicione um novo livro à sua biblioteca!</p>
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
            placeholder="Número de págins do livro"
            onChange={(e) => setPages(e.target.value)}
            value={pages}
          />
        </label>
        {!response.loading && <button className="btn">Criar livro!</button>}
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

export default CreateBook;
