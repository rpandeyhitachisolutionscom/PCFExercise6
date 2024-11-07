/* eslint-disable @typescript-eslint/no-explicit-any */
export const getData = async (clientOrgURL: string, requestApiQuery?: string): Promise<any> => {
    const clientUrl = clientOrgURL;
    //const queryString = query ? `?${query}` : "";
    const requestUrl = `${clientUrl}/api/data/v9.1/${requestApiQuery}`;
    try {
        const response = await fetch(requestUrl, {
            method: "GET",
            headers: {
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
                "Prefer": "odata.include-annotations=OData.Community.Display.V1.FormattedValue"
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

        console.log(data);
        return data;
    } catch (error) {
        console.error("Error in getData:", error);
        throw error;
    }
}
export const postDataQoute = async (clientOrgURL: string, entitySetName: string, data: any): Promise<any> => {
    const clientUrl = clientOrgURL;
    const requestUrl = `${clientUrl}/api/data/v9.1/${entitySetName}`;

    try {
        const response = await fetch(requestUrl, {
            method: "POST",
            headers: {
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error posting data: ${response.statusText}`);
        }
        const location = response.headers.get("OData-EntityId");
        let quoteId = null;

        if (location) {
            // Extract the ID from the location URL
            quoteId = location.split("(")[1].split(")")[0]; // Extract ID
            console.log("Quote created with ID:", quoteId);
        }
        // const responseData = await response.json();
        return quoteId;
    } catch (error) {
        console.error("Error in postData:", error);
        throw error;
    }
}

export const postData = async (clientOrgURL: string, entitySetName: string, data: any): Promise<any> => {
    const clientUrl = clientOrgURL;
    const requestUrl = `${clientUrl}/api/data/v9.1/${entitySetName}`;

    try {
        const response = await fetch(requestUrl, {
            method: "POST",
            headers: {
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error posting data: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error in postData:", error);
        throw error;
    }
}


export const updateData = async (clientOrgURL: string, entitySetName: string, id: string, data: any): Promise<any> => {
    const url = `${clientOrgURL}/api/data/v9.2/${entitySetName}(${id})`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
                "Prefer": "odata.include-annotations=*"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const location = response.headers.get("OData-EntityId");
            let quoteId = null;

            if (location) {
                quoteId = location.split("(")[1].split(")")[0]; // Extract ID
                console.log("Quote created with ID:", quoteId);
            }
            return quoteId;
        } else {
            // If response is not OK, parse and throw error
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'Unknown error');
        }
    } catch (error) {
        // Handle errors here (e.g., network errors, parsing issues)
        console.error("Error updating record:");
    }
};
