const API_URL = 'https://graphql.datocms.com/'; //link da API
const API_TOKEN = import.meta.env.VITE_DATOCMS_READ_ONLY_API_TOKEN; //TOEKN DE ACESSO 

if (!API_TOKEN) {
  console.error('API_TOKEN não está definido. Verifique seu arquivo .env.local.');
} //caso não encontre o token, mostra mensagem de erro


// Define a estrutura de resposta da Api (T= indica um campo genérico, pode ser qualquer tipo) e um campo errors que retorna mensagens de erros
interface ApiResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}
 
async function fetchCmsAPI<T>(query: string ): Promise<T> {
  //query: string: Este parâmetro é uma string que contém a consulta GraphQL que você deseja executar
 // <T> é um espaço reservado onde indica que quando chamar a função, podemos dizer o tipo de dado que queremos receber de volta
 // Promise<T> : indica que a funçaõ vai retornar uma promessa, e a promessa vai receber o tipo de dados que foi definido quando chama a função
  const res = await fetch(API_URL, { //uso do fetch para fazer requisição http,no caso a url é a API_URL
    method: 'POST',
    headers: { // o cabeçalho da requisição, indica que será uma requisição em JSON e inclue token de autenticação
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ // converte as consultas em uma string JSON
      query
   
    }),
  });

  const json: ApiResponse<T> = await res.json(); //converte os dados de json para js

  if (json.errors) {
    throw new Error('Failed to fetch API');
  }

  return json.data; //retorna o resultado da consulta GraphQL
}
//INTERFACE Product
interface Product {
  id: string;
  preco: number | null;
  nomeDoProduto: string;
  imgproduto: {
    url: string; 
  };
}

interface AllCatalogosResponse {
  allCatalogos: Product[];
}

export async function getAllProducts(): Promise<Product[]> {
  const data = await fetchCmsAPI<AllCatalogosResponse>(`
    {
      allCatalogos {
        id
        preco
        nomeDoProduto
        imgproduto {
          url
        }
      }
    }
  `);
  return data.allCatalogos;
}

export default getAllProducts;
