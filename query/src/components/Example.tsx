import { useQuery } from "react-query"
// import { useImmer } from "use-immer"
import { z } from "zod"

const req = new Request(
  "https://randomuser.me/api/?nat=es,fi,fr,gb&results=50&seed=science"
)
// async function getGithubStats() {
//   try {
//     const res = await fetch(req)
//     const data = await res.json()
//     return data
//   } catch (error) {
//     console.log("ERROR", error.message)
//   }
// }
// const data = await getGithubStats()

const Person = z.object({
  dob: z.object({
    date: z.date(),
    age: z.number(),
  }),
  email: z.string().email(),
  gender: z.string(),
  location: z.object({
    city: z.string(),
    country: z.string(), 
  }),
  nat: z.string(),
  name: z.object({
    title: z.string(),
    first: z.string(),
    last: z.string(),
  }),
  picture: z.object({
    large: z.string().url(),
    medium: z.string().url(),
    thumbnail: z.string().url(),
  })
})

type Person = z.infer<typeof Person>

const countries = ["ES", "FR", "FI", "GB"]

function sort(people: Person[]) {
  return people.sort((a, b) => {
    const nameA = a.name.last.toUpperCase()
    const nameB = b.name.last.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
}

export const Example = () => {
  const { isLoading, error, data } = useQuery("userData", () =>
    fetch(req).then(res => res.json())
  )
  if (isLoading) return <div>Loading...</div>
  let errorMessage = "An unknown error has occurred"
  if (error instanceof Error) {
    errorMessage = `An error has occurred: ${error.message}`
  }
  if (error) return <div>{errorMessage}</div>
  
  const { results }: { results: Person[] } = data
  const users = sort(results)
  // const [users, updateUsers] = useImmer(people)
  return (
    <div  
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
      }}
    >
      {/* <pre style={{fontSize: "1rem"}}>{JSON.stringify(results[0], undefined, 2)}</pre> */}
      {countries.map((country, idx) => (
        <button key={idx} style={{cursor: "pointer"}}>{country}</button>
      ))}
      {users.map(user => (
        <div 
          key={user.email}
          style={{
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <img 
            src={user.picture.large} 
            alt={user.name.first + " " + user.name.last}
            style={{ borderRadius: "100%" }}
          />
          <h1 style={{fontSize: "1rem"}}>
            {user.name.first} {user.name.last}
          </h1>
          <h2 style={{fontSize: "1rem"}}>{user.location.country}</h2>
        </div>
      ))}
    </div>
  )
}
