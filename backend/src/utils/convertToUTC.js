export const toUTC =(dateString)=>{
    const date=new Date(dateString)
    return date.toISOString()
}