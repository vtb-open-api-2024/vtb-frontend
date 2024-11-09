import styles from './styles.module.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { HeroPG } from './one-way-pages/hero-page/HeroPG';
import { LogInPage } from './one-way-pages/log-in-page/LogInPage';
import { SignUpPage } from './one-way-pages/sign-up-page/SignUpPage';
import { CreatePswPage } from './one-way-pages/create-psw-page/CreatePswPage';
import { PwdEntryPage } from './one-way-pages/create-psw-page/PwdEntryPage';
import { MainPage } from './func-pages/main-page/MainPage';
import { AuthPage } from './one-way-pages/auth-page/AuthPage';
import { BindCardPage } from './one-way-pages/bind-card-page/BindCardPage';
import { BuyCryptoPage } from './func-pages/buy-page/BuyCryptoPage';
import { TransActionPage } from './one-way-pages/tansaction-approvedORrejected-page/TranSactionPage';
import { ShareAppPG } from './one-way-pages/share-app/ShareAppPage';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './redux/store';
import { auth } from './api/auth';
import { login, logout, setAuthError, setSignInError, setTokens } from './redux/authSlice';
import { History } from './func-pages/history-page/History';
import { useEffect, useRef } from 'react';
import { ExchangePage } from './func-pages/exchange-page/Exchange';
import { request } from './api/api';
import { PopUpCMP } from './components/pop-up/PopUp';
import { closePopUp, openPopUp, updatePopUpData } from './redux/popUpSlice';
import { addWallet, setWallets } from './redux/walletsSlice';
import { bindCardPopupData, inviteFriendPopupData } from './mockData';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  // auth states
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const signInError = useSelector((state: RootState) => state.auth.signInError);
  const authError = useSelector((state: RootState) => state.auth.authError);
  const passwordConfirmed = useSelector((state: RootState) => state.auth.passwordConfirmed);
  const loggedByPassword = useSelector((state: RootState) => state.auth.loggedByPassword);
  const tokens = useSelector((state: RootState) => state.auth.tokens);

  // user portfolios & wallets states
  const wallets = useSelector((state: RootState) => state.wallets);
  const popUpData = useSelector((state: RootState) => state.popup.data);
  const isPopUpOpen = useSelector((state: RootState) => state.popup.isOpen);

  const moveTo = useNavigate();

  const popupRef = useRef<HTMLDivElement>(null);

  function handleSignInSubmit(number: string) {
    auth
      .getVerifCode({ phone: number })
      .then(() => {
        dispatch(setSignInError(false));
        moveTo('/auth');
      })
      .catch(() => {
        dispatch(setSignInError(true));
      });
  }

  function handleAuthCodeSubmit(code: string) {
    auth
      .sendVerifCode(code)
      .then((tokens) => {
        setAuthError(false);
        dispatch(setTokens(tokens));
        if (passwordConfirmed) {
          moveTo('/psw-enter');
        } else {
          moveTo('/psw-create');
        }
      })
      .catch(() => {
        setAuthError(true);
        dispatch(logout());
      });
  }

  function handleLoggedByPassword() {
    moveTo('/home');
    openBindCardPopup();
  }

  function handleCreatePassword() {
    moveTo('/psw-enter');
  }

  function handleForgotPassword() {
    moveTo('/psw-create');
  }

  function validateToken() {
    if (tokens) {
      return auth
        .validateToken(tokens)
        .then((valid) => {
          if (valid) {
            dispatch(login())
          } else {
            auth.refreshToken(tokens).then((tokens) => {
              dispatch(setTokens(tokens))
              dispatch(login())
            }).catch(() => {
              dispatch(logout())
              console.log('error on refreshTokens')
            })
          }
          
        })
        .catch(() => {
          dispatch(logout());
        });
    }
    return Promise.reject().then(() => {}, (err) => {
      console.log('no tokens in localstorage')
    })
  }

  function getWallets() {
    // todo: fix logics
    
    validateToken().then(() => 
      request
        .getWallets()
      )
      .then((wallets) => {
        if (!wallets) {
          return true;
        }
        dispatch(setWallets(wallets));
        return false;
      })
      .then((emptywallets: boolean) => {
        if (emptywallets) return request.postWallet();
        return null;
      })
      .then((newWallet) => {
        if (newWallet !== null) {
          dispatch(addWallet(newWallet));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    validateToken()
    // TODO: ProtectedRoute for auth
    if (tokens && passwordConfirmed) {
      dispatch(login());
      moveTo('/psw-enter');
    } else if (tokens) {
      moveTo('/psw-create');
    } else {
      moveTo('/');
    }
  }, []);

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated) getWallets();
  }, [isAuthenticated]);

  function openBindCardPopup() {
    const isBind = localStorage.getItem('isCardBound');
    if (isBind) {
      return;
    } else {
      dispatch(updatePopUpData(bindCardPopupData));
      dispatch(openPopUp());
    }
  }

  function openInviteFriensCardPopup() {
    const isBind = localStorage.getItem('isFriendsInvited');
    if (isBind) {
      return;
    } else {
      dispatch(updatePopUpData(inviteFriendPopupData));
    }
  }

  function closePopup() {
    dispatch(closePopUp());
  }

  // closes popup on touch
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        dispatch(closePopUp());
        dispatch(
          updatePopUpData({
            waypoint: '',
            msg: '',
            desc: '',
            img: '',
          }),
        );
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopUpOpen]);

  function handleConfirmOperation() {
    moveTo('/confirm');
  }

  return (
    <Provider store={store}>
      <div className="layout">
        <div ref={popupRef} className={styles.popUp + ' ' + (isPopUpOpen ? styles.popUpVisible : styles.popUpHidden)}>
          {isPopUpOpen && (
            <PopUpCMP
              msg={popUpData.msg}
              waypoint={popUpData.waypoint}
              desc={popUpData.desc}
              img={popUpData.img}
              closePopup={closePopup}
            />
          )}
        </div>
        <Routes>
          <Route path="/" element={<HeroPG waypoint={'/sign-up'} spareWaypoint={'/binding'} />} />
          <Route path="/binding" element={<LogInPage waypoint="/auth" spareWaypoint="/sign-up" />} />
          <Route path="/sign-up" element={<SignUpPage signInHandler={handleSignInSubmit} />} />
          <Route path="/auth" element={<AuthPage error={authError} authHandler={handleAuthCodeSubmit} />} />
          <Route path="/psw-create" element={<CreatePswPage handleCreatePassword={handleCreatePassword} />} />
          <Route
            path="/psw-enter"
            element={
              <PwdEntryPage
                handleLoggedByPassword={handleLoggedByPassword}
                handleForgotPassword={handleForgotPassword}
              />
            }
          />
          <Route path="/home" element={<MainPage />} />
          <Route path="/bind-card" element={<BindCardPage waypoint="/buy" spareWaypoint="/home" />} />
          <Route path="/buy" element={<BuyCryptoPage waypoint="/confirm" spareWaypoint="/home" />} />
          <Route path="/exchange" element={<ExchangePage confirmExchange={handleConfirmOperation} />} />
          <Route
            path="/confirm"
            element={<PwdEntryPage handleLoggedByPassword={handleLoggedByPassword} handleForgotPassword={handleForgotPassword} />}
          />
          <Route path="/transaction" element={<TransActionPage waypoint="/home" />} />
          <Route path="/share-app" element={<ShareAppPG waypoint="/home" />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
