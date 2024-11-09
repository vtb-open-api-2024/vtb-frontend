import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { CancelIcon } from '../../components/icons/cancel';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { checkPassword, resetPassword } from '../../redux/authSlice';

interface iPwdEntryPage {
  waypoint?: string;
  spareWaypoint?: string;
  handleLoggedByPassword: () => void;
  handleForgotPassword: () => void;
}

export const PwdEntryPage = ({ handleLoggedByPassword, handleForgotPassword }: iPwdEntryPage) => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedByPassword = useSelector((state: RootState) => state.auth.loggedByPassword);

  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('Введите пароль, чтобы продолжить');

  const checkPswd = (input: string) => {
    dispatch(checkPassword(currentPassword));
  };

  const handleDelete = () => {
    setCurrentPassword((prev) => prev.slice(0, -1));
  };

  const handleNumberClick = (number: number) => {
    if (currentPassword.length < 4) {
      setCurrentPassword((prev) => prev + number);
    }
  };

  useEffect(() => {
    if (currentPassword.length === 4) {
      checkPswd(currentPassword);
    }
  }, [currentPassword]);

  useEffect(() => {
    if (loggedByPassword) {
      handleLoggedByPassword();
    } else if (loggedByPassword !== null) {
      setMessage('Пароль неверен. Попробуйте еще раз');
      setCurrentPassword('');
    }
  }, [loggedByPassword]);

  function forgotPassword() {
    dispatch(resetPassword());
    handleForgotPassword();
  }

  return (
    <div className={'page one-way-page'}>
      <div className={styles.container}>
        <div className={styles.numpadWrapper}>
          <h1 className={styles.header}></h1>
          <h2 className={styles.optionView}>{message}</h2>

          {/* Password squares */}
          <div className={styles.passwordSquares}>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className={styles.passwordSquare}>
                {currentPassword[index] ? '•' : ''}
              </div>
            ))}
          </div>

          {/* Numpad */}
          <div className={styles.numpad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button key={number} className={styles.numpadButton} onClick={() => handleNumberClick(number)}>
                {number}
              </button>
            ))}
            <button className={styles.numpadButton} style={{ border: 'none' }} onClick={handleDelete}>
              <CancelIcon />
            </button>
            <button key={0} className={styles.numpadButton} onClick={() => handleNumberClick(0)}>
              {0}
            </button>
          </div>
          <div className={styles.bottomText} onClick={forgotPassword}>
            Забыли пароль?
          </div>
        </div>
      </div>
    </div>
  );
};
