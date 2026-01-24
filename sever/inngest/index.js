import { Inngest } from "inngest";
import prisma  from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-mgt4939" });

//inmgest function to save user data database
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},

    async ({event}) => {
        const {data} = event;
        await prisma.user.create({
            data:{
                id: data.id,
                email: data?.email_addresses[0].email_address,
                name: data?.first_name + ' ' + data?.last_name,
                image: data?.image_url
            }
        })
    }
)


//Inngest function to save user data database
const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-from-clerk'},
    {event:'clerk/user.deleted'},

    async ({event}) => {
        const {data} = event;
        await prisma.user.delete({
            where:{
                id: data.id,
            }
        })
    }
)

//Inngest function to update user data in database
const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},

    async ({event}) => {
        const {data} = event;
        await prisma.user.update({
            where:{
                id: data.id,
            },
            data:{
                id: data.id,
                email: data?.email_addresses[0].email_address,
                name: data?.first_name + ' ' + data?.last_name,
                image: data?.image_url
            }
        })
    }
)

// Inngest Function to save workspace data to a database
const syncWorkspaceCreation = inngest.createFunction(
    {id:'sync-workspace-from-clerk'},
    {event:'clerk/workspace.created'},

    async ({event}) => {
        const {data} = event;
        await prisma.workspace.create({
            data:{
                id: data.id,
                name: data.name,
                slug: data.slug,
                image_url: data.image_url,
                ownerId: data.created_by,

            }
        })

        //Add creater as ADMIN member
        await prisma.workspaceMember.create({
            data:{
                userId: data.created_by,
                workspaceId: data.id,
                role: 'ADMIN',
            }
        })
    }
)
// Inngest Function to update workspace data in a database
const syncWorkspaceUpdation = inngest.createFunction(
    {id:'update-workspace-from-clerk'},
    {event:'clerk/workspace.updated'},
    async ({event}) => {
        const {data} = event;
        await prisma.workspace.update({
            where:{
                id: data.id,
            },
            data:{name: data.name,
                slug: data.slug,
                image_url: data.image_url
            }
        })
    }
)

//Inggest function to delete workspace data from database
const syncWorkspaceDeletion = inngest.createFunction(
    {id:'delete-workspace-from-clerk'},
    {event:'clerk/workspace.deleted'},
    async ({event}) => {
        const {data} = event;
        await prisma.workspace.delete({
            where:{
                id: data.id,
            }
        })
    }
)

//Inngest function to save workspace member data to database
const syncWorkspaceMemberCreation = inngest.createFunction(
    {id:'sync-workspace-member-from-clerk'},
    {event:'clerk/workspace_member.created'},

    async ({event}) => {
        const {data} = event;
        await prisma.workspaceMember.create({
            data:{
                userId: data.user_id,
                workspaceId: data.organization_id,
                role: String(data.role_name).toUpperCase(),
            }
        })
    }  
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    syncWorkspaceCreation,
    syncWorkspaceUpdation,
    syncWorkspaceDeletion,
    syncWorkspaceMemberCreation
]