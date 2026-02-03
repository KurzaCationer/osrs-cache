import fs from 'node:fs'
import { useCallback, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { css } from '../../styled-system/css'

/*
const loggingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    console.log("Request:", request.url);
    return next();
  }
);
const loggedServerFunction = createServerFn({ method: "GET" }).middleware([
  loggingMiddleware,
]);
*/

const TODOS_FILE = 'todos.json'

async function readTodos() {
  return JSON.parse(
    await fs.promises.readFile(TODOS_FILE, 'utf-8').catch(() =>
      JSON.stringify(
        [
          { id: 1, name: 'Get groceries' },
          { id: 2, name: 'Buy a new phone' },
        ],
        null,
        2,
      ),
    ),
  )
}

const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => await readTodos())

const addTodo = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const todos = await readTodos()
    todos.push({ id: todos.length + 1, name: data })
    await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
    return todos
  })

export const Route = createFileRoute('/demo/start/server-funcs')({
  component: Home,
  loader: async () => await getTodos(),
})

function Home() {
  const router = useRouter()
  let todos = Route.useLoaderData()

  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(async () => {
    todos = await addTodo({ data: todo })
    setTodo('')
    router.invalidate()
  }, [addTodo, todo])

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minH: 'screen',
        p: '4',
        color: 'white',
        bgGradient: 'to-br',
        gradientFrom: 'zinc.800',
        gradientTo: 'black'
      })}
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 20% 60%, #23272a 0%, #18181b 50%, #000000 100%)',
      }}
    >
      <div className={css({
        w: 'full',
        maxW: '2xl',
        p: '8',
        rounded: 'xl',
        backdropBlur: 'md',
        bg: 'black/50',
        shadow: 'xl',
        borderWidth: '8px',
        borderColor: 'black/10'
      })}>
        <h1 className={css({ fontSize: '2xl', mb: '4' })}>Start Server Functions - Todo Example</h1>
        <ul className={css({ mb: '4', display: 'flex', flexDirection: 'column', gap: '2' })}>
          {todos?.map((t: any) => (
            <li
              key={t.id}
              className={css({
                bg: 'white/10',
                borderWidth: '1px',
                borderColor: 'white/20',
                rounded: 'lg',
                p: '3',
                backdropBlur: 'sm',
                shadow: 'md'
              })}
            >
              <span className={css({ fontSize: 'lg', color: 'white' })}>{t.name}</span>
            </li>
          ))}
        </ul>
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitTodo()
              }
            }}
            placeholder="Enter a new todo..."
            className={css({
                              w: 'full', px: '4', py: '3', rounded: 'lg', borderWidth: '1px', borderColor: 'white/20', bg: 'white/10', backdropBlur: 'sm', color: 'white', _placeholder: { color: 'white/60' }, outline: 'none',
                              _focus: { ringWidth: '2', ringColor: 'blue.400', borderColor: 'transparent' }
            })}
          />
          <button
            disabled={todo.trim().length === 0}
            onClick={submitTodo}
            className={css({
              bg: 'blue.500',
              color: 'white',
              fontWeight: 'bold',
              py: '3',
              px: '4',
              rounded: 'lg',
              transition: 'colors',
              _hover: { bg: 'blue.600' },
              _disabled: { bg: 'blue.500/50', cursor: 'not-allowed' }
            })}
          >
            Add todo
          </button>
        </div>
      </div>
    </div>
  )
}