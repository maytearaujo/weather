# Aplicativo de Previsão do Tempo

## Visão Geral

Este aplicativo de clima foi desenvolvido durante o curso **AI Training for Software Developer**, usando React e Vite. Ele permite que o usuário insira o nome de uma cidade, obtenha as coordenadas usando a API de geocodificação do Open-Meteo e busque dados meteorológicos atuais para aquela localização.

O app exibe temperatura, condição do tempo, velocidade do vento e temperaturas máxima e mínima do dia. Ele também inclui tratamento de erros para cidades inválidas.

## Permissão de Uso da API

Este projeto utiliza a API pública do Open-Meteo para geocodificação e previsão do tempo. A API Open-Meteo não exige chave de acesso para os endpoints usados aqui e permite uso gratuito, mas deve ser utilizada conforme os termos de serviço do próprio Open-Meteo.

- As chamadas são feitas via `fetch` diretamente para `https://geocoding-api.open-meteo.com` e `https://api.open-meteo.com`.
- Não há credenciais armazenadas neste projeto.
- Para uso em produção, verifique os limites de requisição e os termos de uso do Open-Meteo.

## Instalação

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd weather
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra o navegador em `http://localhost:5173`

## Guia de Uso

1. Digite o nome de uma cidade no campo de busca.
2. Clique em **Buscar**.
3. Aguarde enquanto o app consulta a API.
4. Veja os dados meteorológicos exibidos na tela.

## Exemplo de Resultado

```text
São Paulo
Temperatura atual: 25°C
Condição: Principalmente limpo
Velocidade do vento: 12 km/h
Máxima hoje: 30°C
Mínima hoje: 18°C
```

## Funcionalidades

- Busca por nome da cidade
- Conversão de cidade em coordenadas usando Open-Meteo Geocoding API
- Consulta de dados meteorológicos com Open-Meteo Forecast API
- Exibição de:
  - cidade
  - temperatura atual
  - condição do tempo
  - velocidade do vento
  - máxima e mínima do dia
- Tratamento de erro para cidade não encontrada
- Exibição de estado de carregamento

## Estrutura do Projeto

- `src/App.tsx`: componente principal que renderiza a página Home
- `src/assets/pages/Home.tsx`: página que orquestra busca e resultado
- `src/assets/components/SearchBar/index.jsx`: componente de formulário de busca
- `src/assets/components/WeatherCard/index.jsx`: componente de exibição do clima
- `src/assets/hooks/useWeather.js`: hook que busca dados e gerencia estados
- `src/assets/services/weatherService.js`: chamadas às APIs do Open-Meteo

## Melhorias Futuras

- Adicionar suporte a umidade relativa do ar
- Exibir previsão para os próximos dias
- Mostrar ícones do tempo baseados no código de clima
- Registrar respostas em arquivo ou em um backend de logs
- Melhorar o layout para ser totalmente responsivo
- Implementar cache local para reduzir chamadas repetidas à API

## Observações

A API atual do Open-Meteo retorna dados de clima atuais e previsões diárias. A umidade pode ser adicionada na chamada da API se você incluir os parâmetros adequados no endpoint.
