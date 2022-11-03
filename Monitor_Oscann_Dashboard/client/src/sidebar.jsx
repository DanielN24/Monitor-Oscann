import React, { useEffect, useState } from 'react';
import { CDBSidebarContent, CDBSidebarHeader } from 'cdbreact';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './stylesheets/sidebar.css';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import {FaRegThumbsUp} from "@react-icons/all-files/fa/FaRegThumbsUp";
import {TbAlertTriangle} from "react-icons/tb";
import { Link } from 'react-router-dom';

function Sidebar() {

    const URL = 'http://localhost:4600/api/getAll'
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [idInterval, setIdInterval] = useState(null)
    
    const getRecords = async () => {
        const response = await fetch(URL);
        const records = await response.json();
        setRecords(records);
    }

    useEffect(() => {
        if(!idInterval & records & records.length){
            let interval = setInterval(() => {
                getRecords();
            }, 1000);
            setIdInterval(interval);
        }

    }, [records, idInterval]);
    useEffect(() => {
        getRecords();
    }, []);

    // icons with the respective color to use in the sidebar
    const iconColorGreen = <FaRegThumbsUp className='mySubIcon2' style={{ color: 'green' }} />
    const iconColorOrange = <TbAlertTriangle className='mySubIcon2' style={{ color: 'orange' }} />
    const iconColorRed = <IoMdCloseCircleOutline className='mySubIcon2' style={{ color: 'red' }} />

    // condition used to open and close the sidebar
    const [isOpen, setIsOpen] = useState()
    if (!isOpen) {
        return (
            <i className="fa fa-bars fa-large" style={{ margin: 30, cursor: 'pointer', color: 'black' }} onClick={function () {
                setIsOpen(true)
            }}></i>
        )
    }
    return (
        <div>
            <ProSidebar>
                <div className='ProSidebar'>
                    <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" onClick={function () {
                        setIsOpen()
                    }}></i>}>
                        <Link to='/' style={{ textDecoration: 'none', color: 'inherit', paddingTop: '15px' }}><div className='logoA'></div></Link>
                    </CDBSidebarHeader>
                    <CDBSidebarContent>
                        <Menu>
                            <div className="searchContainer">
                                <input
                                    placeholder="Search..."
                                    onChange={event => { setSearchTerm(event.target.value) }}
                                />
                            </div>
                            <div className='mennu2' > 
                                
                                {records.filter((loop) => {
                                // condition used to filter the distributors by the name in the search bar
                                // also you can search it in lower case or upper case
                                    if (searchTerm === ""){
                                        return loop
                                    }
                                    if (loop.nombre_distribuidor.toLowerCase().includes(searchTerm.toLowerCase())){
                                        return loop
                                    }
                                    return false;
                                // this code allows to renderize the hierarchy sidebar and also add the respective icon for each menu and sub menus
                                }).map((loop, index) => (
                                    <div className='Menu' key={index}>
                                        <SubMenu className='nameDis' title={loop.nombre_distribuidor} key={index} icon={
                                            loop.Maximo_Distributor  === "0" ?  <FaRegThumbsUp className='myIcon' style={{ color: 'green' }} />
                                            : loop.Maximo_Distributor === "1" ? <TbAlertTriangle className='myIcon' style={{ color: 'orange' }} />
                                            : <IoMdCloseCircleOutline className='myIcon' style={{ color: 'red' }}/>
                                            }>
                                            {loop.Distribuidores_hospitalarios.map((loop1, index) => (
                                                <SubMenu title={loop1.DH_name} key={index} icon={
                                                    loop1.Maximo_Dist_Hosp === 0 ? <FaRegThumbsUp className='mySubIcon1' style={{ color: 'green' }} />
                                                    : loop1.Maximo_Dist_Hosp === 1 ? <TbAlertTriangle className='mySubIcon1' style={{ color: 'orange' }} />
                                                    : <IoMdCloseCircleOutline className='mySubIcon1' style={{ color: 'red' }} />
                                                }>
                                                    {loop1.Hospitales.map((loop2, index) => (
                                                        <SubMenu title={loop2.hospital_name} key={index} icon={
                                                            loop2.Maximo_Hospital === 0 ? iconColorGreen
                                                            : loop2.Maximo_Hospital === 1 ? iconColorOrange
                                                            : iconColorRed
                                                        }>
                                                            {loop2.Oscann.map((loop3, index) =>( 
                                                                <div  key={index}><MenuItem  icon={
                                                                    (loop3.Maximo_oscann === 0 ? iconColorGreen : (loop3.Maximo_oscann === 1 ? iconColorOrange : iconColorRed))
                                                                    }>
                                                                    <div className='nameDevices' key={index}>
                                                                         <Link to={`/Device/${loop3.id_oscann}/${loop3.NAME}/${loop2.hospital_name}/${loop1.DH_name}/${loop.nombre_distribuidor}`} style={{ color: 'inherit' }}>{loop3.NAME} </Link>
                                                                    </div></MenuItem>
                                                                </div>
                                                            ))}
                                                        </SubMenu>
                                                    ))}
                                                </SubMenu>
                                            ))}
                                        </SubMenu>
                                    </div>
                                ))}
                            </div>
                        </Menu>
                    </CDBSidebarContent>
                </div>
            </ProSidebar>
        </div>
    );
};

export default Sidebar;
