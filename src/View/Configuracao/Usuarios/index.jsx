import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';

import api from "../../../services/api";
import Tabela from '../../../componentes/Tabela';
import Coluna from '../../../componentes/Coluna';
import FormModal from './FormModal';
import InfoBox from '../../../componentes/InfoBox';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [membros, setMembros] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState({
        permissoes: [{}]
    });
    const [listaMenu, setListaMenu] = useState([]);
    const [quantidadeTotal, setQuantidadeTotal] = useState(0);
    const [show, setShow] = useState(false);
    const [usuariosPesquisa, setUsuariosPesquisa] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const { addToast } = useToasts();

    useEffect(() => {
        const requisicao = async () => {
            await api.get("/usuarios")
                .then(response => {
                    setUsuarios(response.data);

                    const quantidade = response.data.length;

                    setQuantidadeTotal(quantidade);
                });

            fetchMenu();
        }

        document.title = "Usuários - Cadastro de membros CEM";

        requisicao();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const requisicao = async () => {
            await api.get("/usuarios")
                .then(response => {
                    setUsuarios(response.data);

                    const quantidade = response.data.length;

                    setQuantidadeTotal(quantidade);
                });
        }

        requisicao();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const fetchMenu = async () => {
        const response = await api.get("/menuPermissao");

        setListaMenu(response.data);

        fetchMembros();
    }

    const fetchMembros = async () => {
        const response = await api.get("/membros");

        setMembros(response.data);
    }

    const pesquisar = e => {
        let filteredSuggestions = usuarios.filter((suggestion) => {
            return suggestion.nome
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .includes(
                    e.currentTarget.value
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase()
                );
        });

        setUsuariosPesquisa(filteredSuggestions);
        setPesquisa(e.target.value);
    }

    const remover = async (id) => {
        const response = await api.delete("/usuarios/" + id);

        if (!response.data.error) {
            const items = usuarios.filter(item => item.id !== id);

            setUsuarios(items);

            addToast("Usuário removido com sucesso!", { appearance: 'success' });
        } else {
            addToast("Não foi possível remover o usuário!", { appearance: 'error' });
        }
    }

    const opcoes = (usuario) => {
        return (
            <>
                <button
                    key={usuario.id + "editar"}
                    className="btn btn-primary btn-xs"
                    onClick={() => {
                        setUsuarioSelecionado(usuario);
                        setShow(true);
                    }}
                    title="Editar usuário"
                >
                    <i className="fa fa-gear"></i>
                </button>
                &nbsp;
                <button
                    key={usuario.id + "remover"}
                    type="button"
                    onClick={() => remover(usuario.id)}
                    value={usuario.id}
                    className="btn btn-danger btn-xs"
                    title="Remover usuário"
                >
                    <i className="fa fa-trash"></i>
                </button>
            </>
        )
    }

    const handleShow = async () => {
        setUsuarioSelecionado({
            permissoes: [{}]
        });

        setShow(!show);

    }

    return (
        <>
            <div className="wrapper-content row">
                <InfoBox corFundo="primary" icone="user-circle-o" quantidade={quantidadeTotal} titulo="Total" />
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className="fa fa-search color-gray"></i>
                                        </span>
                                    </div>
                                    <input
                                        className="form-control"
                                        onChange={pesquisar}
                                        value={pesquisa}
                                        placeholder="Pesquise por nome"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="card overflow-hidden align-items-center">
                        <Tabela
                            data={pesquisa ? usuariosPesquisa : usuarios}
                            titulo="Usuários"
                            mostrarBotaoNovo={true}
                            tituloBotao="Novo Usuário"
                            handleShow={handleShow}
                        >
                            <Coluna campo="nome" titulo="Nome" tamanho="20" />
                            <Coluna campo="email" titulo="E-mail" tamanho="20" />
                            <Coluna campo="nivel" titulo="Nivel" tamanho="12" />
                            <Coluna titulo="Opções" corpo={(item) => opcoes(item)} tamanho="10" />
                        </Tabela>
                    </div>
                </div>
            </div>
            <FormModal
                className="modal-lg overflow-hidden"
                data={usuarioSelecionado}
                show={show}
                handleShow={handleShow}
                listaMenu={listaMenu}
                membros={membros}
            />
        </>
    )
}

export default Usuarios;