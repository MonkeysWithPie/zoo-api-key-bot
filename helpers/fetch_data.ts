export async function fetchData() {
    const userId = process.env.USER_ID as string;

    const response = await fetch(`https://gdcolon.com/zoo/api/profile/${userId}`)
    const data = response.json()

    return data
}