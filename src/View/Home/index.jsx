import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import api from "../../services/api";
import Carregando from "../../componentes/Carregando";
import Utils from '../../componentes/Utils';
import InfoBox from "../../componentes/InfoBox";
import Tabela from "../../componentes/Tabela";
import Coluna from "../../componentes/Coluna";
import { useEffect } from "react";

const Home = () => {
    const [data, setData] = useState({});
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const fetchHome = async () => {
            let response = await api.get("/home");

            setData(response.data);
            setCarregando(false);
        };

        fetchHome();
    }, []);

    return (
        <>
            <div className="row">
                <InfoBox corFundo="success" icone="users" quantidade={data.quantidadeMembros} titulo="Membros" />
                <InfoBox corFundo="danger" icone="globe" quantidade={data.quantidadeVisitantes} titulo="Visitantes" />
                <InfoBox corFundo="info" icone="calendar" quantidade={data.quantidadeEventos} titulo="Eventos" />
            </div>
            <div className="row">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <Tabela titulo="Aniversariantes do Mês" data={data.aniversariantes}>
                        <Coluna
                            titulo="Dia"
                            campo="dataNascimento"
                            corpo={(item) => Utils.converteData(item.dataNascimento, "DD")}
                            tamanho={3}
                        />
                        <Coluna titulo="Nome" campo="nome" tamanho={20} />
                        <Coluna titulo="Idade" campo="idade" tamanho={4} />
                    </Tabela>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <Tabela titulo="Casados do Mês" data={data.casados}>
                        <Coluna
                            titulo="Dia"
                            campo="dataNascimento"
                            corpo={(item) => Utils.converteData(item.dataCasamento, "DD")}
                            tamanho={3}
                        />
                        <Coluna titulo="Nome" campo="nome" tamanho={20} />
                        <Coluna titulo="Idade" campo="idade" tamanho={4} />
                    </Tabela>
                </div>
                {carregando && <Carregando />}
            </div>
        </>
    )
}

export default withRouter(Home);