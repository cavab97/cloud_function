export const user = {
    initialize:{
        system : ({uid}) => {
            const relation = {
                absoluteDeveloper: uid
            }
            return relation
        },
    },
    create:{
        distributor : ({uid}) => {
            const relation = {
                owner: uid
            }
            return relation
        }
    }
}