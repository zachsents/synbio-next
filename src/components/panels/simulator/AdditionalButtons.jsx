import { Button, HoverCard, Stack } from '@mantine/core'
import { FaMagic } from 'react-icons/fa'
import { FiMoreHorizontal } from 'react-icons/fi'
import { ImImage } from 'react-icons/im'
import { RiFileExcel2Line } from "react-icons/ri"
import { AiOutlineTable } from "react-icons/ai"
import { exportToCSV, exportToExcel } from '../../../modules/export'
import { titleFromFileName } from '../../../redux/hooks/workingDirectoryHooks'

export default function AdditionalButtons({ panelId, results, randomizeColors, handleImageExport }) {
    
    const panelTitle = titleFromFileName(panelId)

    return (
        <HoverCard position='bottom-end' transition="scale">
            <HoverCard.Target>
                <Button px={10} variant='outline'><FiMoreHorizontal /></Button>
            </HoverCard.Target>
            <HoverCard.Dropdown sx={hoverDropdownStyle}>
                <Stack align='flex-end'>
                    <Button variant='outline' leftIcon={<FaMagic />} onClick={randomizeColors}>Randomize Colors</Button>
                    <Button variant='outline' leftIcon={<ImImage />} onClick={handleImageExport}>Export Image</Button>
                    <Button variant='outline' leftIcon={<AiOutlineTable />} onClick={() => exportToCSV(results, panelTitle)}>Export CSV</Button>
                    <Button variant='outline' leftIcon={<RiFileExcel2Line />} onClick={() => exportToExcel(results, panelTitle)}>Export Excel</Button>
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}

const hoverDropdownStyle = theme => ({
    backgroundColor: 'transparent',
    border: 'none',
    padding: '20px 0 30px 30px',
})