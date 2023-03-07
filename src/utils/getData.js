export default async function getData(service, params="") {
    const response = await service(params)
    return response?.data
}