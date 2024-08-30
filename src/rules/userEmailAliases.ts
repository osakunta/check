import { admin_directory_v1 } from "@googleapis/admin"
import { z } from "zod"

type Rule<API, T> = {
    getData: (api: API) => Promise<T>,
    predicate: (arg: T) => boolean;
}

const schema = z.object({
    users: z.array( z.object({ primaryEmail: z.string().email(), emails: z.array(z.object({address: z.string().email()})) })),
})

const isAlias = (a: string, b: string) => a.split("@")[0] === b.split("@")[0]

const rule: Rule<admin_directory_v1.Admin, z.infer<typeof schema>> = {
    getData: (api) => api.users.list().then( response => schema.parseAsync(response)),

    predicate: (data) => data.users.every(
        user => user.primaryEmail.endsWith("@satakuntalainenosakunta.fi") ?
            user.emails.some(
                ({address}) => address.endsWith("@satakuntatalo.fi") && isAlias(address, user.primaryEmail)
            )
            :
            true
    )
}

export default rule;