"use client";
import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { toast } from "react-toastify";
import moment from "moment";

import useAPI from "@/utils/useAPI";
import api from "@/utils/api";
import axios from "axios";

const Home: NextPage = () => {
  const [accesses, setAccesses] = useState<any[]>([]);

  const { data: cardMetadata } = useAPI<{ count: number }>("/cards/count");
  const { data: accessesMetadata, mutate: mutateClicks } = useAPI<{
    count: number;
  }>("/accesses/count");
  const { data: loginsMetadata } = useAPI<{ count: number }>("/auth/count");
  const { data: accessesData, mutate: mutateAccesses } =
    useAPI<any[]>("/accesses");
  const { data: paymentsData } = useAPI<{ count: number }>('/payments/count');

  const handleClicksReset = () => {
    toast.promise(
      api.delete("accesses/reset").then(() => mutateClicks()),
      {
        success: "Cliques resetados com sucesso",
        pending: "Resetando cliques...",
        error: "Ocorreu um erro ao resetar os cliques",
      }
    );
  };

  const getClientLocal = async (ip_address: string) => {
    const { data } = await axios.get<{ city: string; region: string }>(
      `https://ipapi.co/${ip_address}/json/`,
    );

    const clientLocal = {
      city: data.city,
      region: data.region,
    };

    return clientLocal;
  };

  const accessesAsync = useMemo(
    async () => {
      return await Promise.all(
        accessesData?.map(async (access) => {
          const ip = access.ip.split(",")[0].trim();
          const local = await getClientLocal(ip);

          return {
            ...access,
            ip,
            local,
          };
        }) ?? []
      );
    },
    [accessesData]
  );

  useEffect(() => {
    accessesAsync.then(accesses => setAccesses(accesses));
  }, [accessesAsync])

  return (
    <div>
      <div className="flex gap-6">
        <div className="flex justify-between p-4 shadow-md rounded-lg flex-grow bg-white">
          <div className="text-[40px]">🖱️</div>
          <div>
            <p className="text-gray-600">Cliques</p>
            <p className="text-2xl font-bold text-end">
              {accessesMetadata?.count}
            </p>
          </div>
        </div>
        <div className="flex justify-between p-4 shadow-md rounded-lg flex-grow bg-white">
          <div className="text-[40px]">✔️</div>
          <div>
            <p className="text-gray-600 whitespace-normal">Online</p>
            <p className="text-2xl font-bold text-end">{accesses?.length}</p>
          </div>
        </div>
        <div className="flex justify-between p-4 shadow-md rounded-lg flex-grow bg-white">
          <div className="text-[40px]">🙋‍♂️</div>
          <div>
            <p className="text-gray-600">Logins</p>
            <p className="text-2xl font-bold text-end">
              {loginsMetadata?.count}
            </p>
          </div>
        </div>
        <div className="flex justify-between p-4 shadow-md rounded-lg flex-grow bg-white">
          <div className="text-[40px]">💵</div>
          <div>
            <p className="text-gray-600">Pix</p>
            <p className="text-2xl font-bold text-end">{paymentsData?.count}</p>
          </div>
        </div>
        <div className="flex justify-between p-4 shadow-md rounded-lg flex-grow bg-white">
          <div className="text-[40px]">💳</div>
          <div>
            <p className="text-gray-600">Cartões</p>
            <p className="text-2xl font-bold text-end">{cardMetadata?.count}</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md p-4 rounded-lg mt-10">
        <div className="flex justify-between">
          <h4>Tráfego de usuários</h4>
          <button
            type="button"
            className="py-2 px-6 bg-red-500 hover:bg-red-600 border border-red-400 rounded-md text-white font-bold "
            onClick={handleClicksReset}
          >
            Resetar cliques
          </button>
        </div>
        <table className="table-auto w-full mt-5">
          <thead>
            <tr>
              <th className="font-normal text-gray-500 text-start">
                Plataforma
              </th>
              <th className="font-normal text-gray-500 text-start">Ação</th>
              <th className="font-normal text-gray-500 text-start">IP</th>
              <th className="font-normal text-gray-500 text-start">Local</th>
              <th className="font-normal text-gray-500 text-start">Hora</th>
            </tr>
          </thead>
          <tbody>
            {accesses?.map((access) => (
              <tr key={access.id}>
                <td className="py-2">{access.platform}</td>
                <td className="py-2">{access.action}</td>
                <td className="py-2">{access.ip}</td>
                <td className="py-2">
                  {access.local.city}, {access.local.region}
                </td>
                <td className="py-2">
                  {moment(access.updatedAt).format("HH:mm:ss")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
