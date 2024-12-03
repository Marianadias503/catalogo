import React, { useEffect, useState } from 'react';
import getAllProducts from '../../lib/datocms'; // Ajuste o caminho conforme necessário


//DEFININDO A INTERFACE PRODUCT
interface Product {
  id: string;
  preco: number | null;
  nomeDoProduto: string;
  imgproduto: {
    url: string;
  }; 
}


function Products() {
  const [products, setProducts] = useState<Product[]>([]); //lista para guardar todos os produtos encontrados
  const [loading, setLoading] = useState<boolean>(true);  //usado para mensagens de carregamento
  const [error, setError] = useState<string | null>(null); //usado para mensagens de erro

  useEffect(() => {
    const fetchProducts = async () => { //fetchProduct = busca os produtos 
      try {
        const data: Product[] = await getAllProducts(); // constante data recebe os dados retonados por getAllProducts()
        setProducts(data); //salva os dados no setProduct
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // O array vazio faz com que o efeito execute apenas uma vez

  if (loading) {
    return <h1>Carregando...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <h1>Produtos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.nomeDoProduto}</h2>
            <p>Preço: {product.preco !== null ? `R$ ${product.preco}` : 'Preço não disponível'}</p>
            <img 
              src={product.imgproduto.url} 
              alt={product.nomeDoProduto} 
              style={{ maxWidth: '200px' }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default Products;
