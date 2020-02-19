import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

import api from "../../services/api";
import NovoVisitante from "./form";
import Menu from "../../componentes/Menu";

class Visitante extends Component {

    state = {
        carregando: false,
        data: [{
            id: "",
            nome: "",
            email: "",
            telefone: "",
            celular: "",
            cep: "",
            endereco: "",
            complemento: "",
            dataVisita: "",
            religiao: "",
            visita: ""
        }],
        VisitanteSelecionado: {
            id: "",
            nome: "",
            email: "",
            telefone: "",
            celular: "",
            cep: "",
            endereco: "",
            complemento: "",
            dataVisita: "",
            religiao: "",
            visita: ""
        },
        isOpen: true,
        tabelaEstaAberta: true,
        error: ""
    }

    async componentDidMount(){
        document.title = "Visitantes - Cadastro de membros CEM";
        this.setState({
            carregando: true
        })
        await this.fetchVisitante();        
    }

    fetchVisitante = async () => {
        let data = await api.get("/visitante/listar");
        this.setState({
            carregando: false,
            data
        })
    };

    toggleTabelaForm = () => {
        this.setState({
            tabelaEstaAberta: !this.state.tabelaEstaAberta
        })
    }

    onClick = e => {
        this.setState({
            VisitanteSelecionado: e.value,
            tabelaEstaAberta: !this.state.tabelaEstaAberta,
        });
    }
    converteData = (rowData, column) => {
        let dataVisita = rowData.dataVisita;
        const [ ano, mes, dia ] = dataVisita.split("-");

        return dataVisita.length > 0 ? ( dia + '/' + mes + '/' + ano ) : ( null );
    }

    pesquisa = e => {
        this.setState({
            pesquisa: e.target.value
        });
    }

    handleChange = e => {
        const [ item, subItem ] = e.target.name.split(".");

        if(subItem) {
            this.setState({
                VisitanteSelecionado: {
                    ...this.state.VisitanteSelecionado,
                    [item]: {
                        [subItem]: e.target.value
                    }
                }
            });
        }else{
            this.setState({
                VisitanteSelecionado: {
                    ...this.state.VisitanteSelecionado,
                    [e.target.name]: e.target.value
                }
            });
        }
    }

    render() {
        const { toggleSidebar } = this.props;
        return (
            <>
                <div className="menu">
                    <Menu toggleTabelaForm={this.toggleTabelaForm} toggleSidebar={toggleSidebar} componente="visitante" 
                    pesquisa={this.pesquisa} />
                </div>
                <div className="container-fluid">
                    <Collapse isOpen={!this.state.tabelaEstaAberta}>
                        <NovoVisitante data={this.state.VisitanteSelecionado} handleChange={this.handleChange} mostrarBotao="true" />
                    </Collapse>
                    <Collapse isOpen={this.state.tabelaEstaAberta}>
                        <DataTable className="table" value={this.state.data} selectionMode="single" globalFilter={this.state.pesquisa}
                        selection={this.state.VisitanteSelecionado} onSelectionChange={this.onClick} >
                            <Column field="nome" header="Nome" />
                            <Column field="email" header="E-mail" />
                            <Column field="telefone" header="Telefone" />
                            <Column field="celular" header="Celular" />
                            <Column field="dataVisita" header="Data visita" body={this.converteData} />
                            <Column field="endereco" header="Endereço" body={this.getEndereco} />
                            <Column field="religiao" header="Religião" />
                        </DataTable>
                        {this.state.carregando && 
                        <div className="text-center text-success">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                    </Collapse>
                </div>
            </>
        )
    }
}

export default Visitante;