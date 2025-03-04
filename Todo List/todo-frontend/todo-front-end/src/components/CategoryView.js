import React, { useContext, useMemo, useState } from 'react';
import '../App.css';
import '../services/apiClient';
import { deleteCategory, fetchCategories } from '../services/categoryServices';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel,
    getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Container, Row, Col, Form, Badge, Button, Pagination } from 'react-bootstrap';
import CategoryModal from './CategoryModal';
import { CategoryContext } from '../contexts/CategoryContext';

function CategoryView(){
    const {categories, onUpdateCategories} = useContext(CategoryContext);
    const [currCategory, setCurrCategory] = useState({});
    const [sortState, setsortState] = useState([{'id': 'category_id', desc: false}]);
    const [filteredData, setFilteredData] = useState();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [showModal, setShowModal] = useState(false);
    const [isAdd, setIsAdd] = useState(true);

    function handleAdd(){
        setIsAdd(true);
        setShowModal(true);
    }

    function handleEdit(catId, catDesc){
        setIsAdd(false);

        const data = {
            'category_id': catId,
            'category_description': catDesc,
        }

        setCurrCategory(data);
        setShowModal(true);
    }

    async function handleDelete(catId){
        try{
            const updatedStat = await deleteCategory(catId);
        
            const deletedCat = {
                'category_id': catId,
                'category_status': 'INACTIVE',
            };

            onUpdateCategories(deletedCat);
        } catch(err){
            alert(`Failed to delete category: ${err}`);
        }
    }

    const columnHelper = createColumnHelper();

    const columns = React.useMemo( () => [
        columnHelper.accessor('category_id', {
            'header': 'NO',
            'cell': info => info.getValue(),
            'enableGlobalFilter': false,
        }),
        columnHelper.accessor('category_description', {
            'header': 'DESCRIPTION',
            'cell': info => {
                const stat = info.row.original.category_status;
                return (
                    <span>
                        {info.getValue()}&nbsp;&nbsp;
                        {stat!=='INACTIVE'?(
                            <Badge bg='success'>{stat}</Badge>
                        ):(
                            <Badge bg='danger'>{stat}</Badge>
                        )}
                    </span>
                );
            }
        }),
        columnHelper.display({
            'header': 'Actions',
            'cell': info => {
                const data = info.row.original;
                const isInactive = data.category_status === 'INACTIVE';
                return (
                    <div className='d-flex gap-2'>
                            <Button variant='outline-primary' size='sm' 
                            onClick={()=>handleEdit(data.category_id, data.category_description)} disabled={isInactive}>Edit</Button>
                            
                            <Button variant='outline-danger' size='sm'
                            onClick={()=>handleDelete(data.category_id)} disabled={isInactive}>Delete</Button>
                        </div>  
                )
            },
            'cursor': 'pointer',
        }),
    ], [])

    const data = React.useMemo(() => categories, [categories]);

    const table = useReactTable({
        data, 
        columns,
        state: {
            sorting: sortState,
            globalFilter: filteredData, 
            pagination,
        },
        onGlobalFilterChange: setFilteredData,
        onPaginationChange: setPagination,
        globalFilterFn: 'includesString',
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setsortState,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return <>
        <Container>
            <Row className="m-3">
                <h3 className="modul-title pb-3">CATEGORY LIST</h3>
            </Row>

            <Row className="m-3 mt-5 filter-container">
                <Col lg={8}>
                    <Form.Control type='text'
                        placeholder='Search Category...'
                        value={filteredData ?? ''}
                        onChange={e => setFilteredData(e.target.value)}
                        style={{ marginBottom: '1rem', width: '300px'}}/>
                </Col>
                <Col lg={4} className="d-flex justify-content-end pb-3 pr-3">
                    <Button variant='primary' onClick={handleAdd}>New Category</Button>
                </Col>
            </Row>

            <Row className="table-container">
                <table className="">
                    <colgroup>
                        <col style={{width:'60px'}}/>
                        <col style={{width:'auto'}}/>
                        <col style={{width:'100px'}}/>
                    </colgroup>
                    <tbody>
                        {table.getRowModel().rows.map(row=>(
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>    
            </Row>

            <Row style={{ marginTop: '2rem'}}>
                <Pagination className="pagination justify-content-center">
                    <Pagination.First onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}/>
                    <Pagination.Prev onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                    />

                    <span className="mx-2 d-flex justify-content-center align-items-center">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>

                    <Pagination.Next onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                    />
                    <Pagination.Last onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}/>
                </Pagination>
            </Row>
        </Container>

        <CategoryModal show={showModal} onHide={()=>setShowModal(false)} isAdd={isAdd} currData={currCategory}/>
    </>
}

export default CategoryView;