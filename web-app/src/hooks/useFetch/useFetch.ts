import { RequestHelper } from "@/api/helpers"
import { useEffect, useState } from "react"

export const useFetch = (url : URL | string, defaultValue : unknown = []) => {

    const [data, setData] = useState(defaultValue)

    const fetch = async () => {
        // Options?
        const response = await RequestHelper.get(url)
        setData(response.data || defaultValue)
    }

    useEffect(() => {
        fetch()
    },[url])

    return {
        data,
        reload: fetch
    }
}