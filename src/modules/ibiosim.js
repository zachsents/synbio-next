// import commands from "./commands"

import { getDocumentStoreState, getFileByName } from "./state/documentStore"

export async function submitAnalysis(input, { environment, parameters }) {

    // create FormData object
    var formdata = new FormData()

    // ensure that file is serialized and saved
    // await commands.FileSave.execute(input.id)

    // construct input file if we have a snippet
    const inputFile = input.snippet ?
        new File([input.snippet], `partial-${input.sourceFile}`) :
        await getFileByName(input.sourceFile)?.handle.getFile()

    // attach input file
    formdata.append("input", inputFile)

    // attach environment if it exists
    environment && formdata.append(
        "environment",
        await getFileByName(environment.sourceFile)?.getFile()
    )

    // attach parameters if they exist
    parameters && Object.entries(parameters)
        .filter(([, value]) => value != null)
        .forEach(
            ([key, value]) => formdata.append(key, value)
        )

    // send request
    const response = await fetch(import.meta.env.VITE_IBIOSIM_API, {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    })

    // parse response as JSON and return
    return await response.json()
}

export async function pollStatus(orchestration) {

    if (!orchestration?.statusQueryGetUri)
        return

    // fetch and parse status
    const response = await fetch(orchestration.statusQueryGetUri)
    const { runtimeStatus, output } = await response.json()

    console.debug("Status:", runtimeStatus)

    return {
        runtimeStatus,
        output: runtimeStatus == "Completed" ?
            await parseOutput(output) :
            output
    }
}

export async function terminateAnalysis(orchestration) {

    if (!orchestration?.terminatePostUri)
        return

    // POST to terminate URI
    return await fetch(orchestration.terminatePostUri, {
        method: 'POST'
    })

    // this will respond with 202 if termination was accepted,
    // or 410 (Gone) if already terminated or complete.
}

async function parseOutput(outputArray) {

    return Object.fromEntries(
        Object.entries(outputArray).map(([fileName, data]) => [
            fileName,
            JSON.parse(
                data
                    .replaceAll('(', '[')
                    .replaceAll(')', ']')
            )
        ])
    )
}