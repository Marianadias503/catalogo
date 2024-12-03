const API_URL = 'https://graphql.datocms.com/';
const API_TOKEN = import.meta.env.VITE_DATOCMS_READ_ONLY_API_TOKEN;

if (!API_TOKEN) {
  console.error('API_TOKEN não está definido. Verifique seu arquivo .env.local.');
}

interface FetchCmsAPIOptions {
  variables?: Record<string, unknown>;
}

interface ApiResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function fetchCmsAPI<T>(query: string, { variables }: FetchCmsAPIOptions = {}): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json: ApiResponse<T> = await res.json();

  if (json.errors) {
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

interface Product {
  id: string;
  preco: number | null;
  nomeDoProduto: string;
  imgproduto: {
    url: string; // Agora é um objeto, não um array
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
