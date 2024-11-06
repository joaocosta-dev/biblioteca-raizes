import { Link } from 'react-router-dom';

import { useAuthValue } from '../../contexts/AuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';

const Dash = () => {
  const { user } = useAuthValue();
};
export default Dash;
