// import formatTodos from "./formatTodos";

// const fetchSuggestion = async (board: Board) => {
//   const todos = formatTodos(board);
//   const response = await fetch("/api/createSummary", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ todos: todos }),
//   });

//   const gptdata = await response.json();
//   const { content } = gptdata;

//   return content;
// };
// export default fetchSuggestion;
