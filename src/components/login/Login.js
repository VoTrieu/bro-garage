import { useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { loginRequest } from "../../store/auth-actions";
import { uiActions } from "../../store/ui-slice";

const Login = (props) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const isShowLoginDialog = useSelector((state) => state.ui.isShowLoginDialog);
  const { errorMessage, loginSuccess } = useSelector((state) => state.auth);

  const defaultValues = {
    UserName: "",
    Password: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onHideLoginForm = () => {
    dispatch(uiActions.showLoginDialog(false));
  };

  const onLogin = () => {
    formRef.current.requestSubmit();
  };

  const onSubmitLogin = (formValue, e) => {
    e.nativeEvent.preventDefault();
    dispatch(loginRequest(formValue));
    reset();
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const loginDialogFooter = (
    <Fragment>
      <Button
        label="Thoát"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHideLoginForm}
      />
      <Button
        label="Đăng nhập"
        icon="pi pi-check"
        className="p-button-text"
        onClick={onLogin}
      />
    </Fragment>
  );

  return (
    <Dialog
      visible={isShowLoginDialog}
      style={{ width: "450px" }}
      header="Đăng nhập"
      modal
      className="p-fluid"
      footer={loginDialogFooter}
      onHide={onHideLoginForm}
    >
      {!loginSuccess && <Message className="mb-3 justify-content-start" severity="error" sticky={true} closable={true} text={errorMessage} />}
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmitLogin)}
        className="formgrid grid"
      >
        <div className="field col-12">
          <label htmlFor="UserName">Tên người dùng</label>
          <Controller
            name="UserName"
            control={control}
            rules={{ required: "Tên người dùng không được để trống!" }}
            render={({ field, fieldState }) => (
              <InputText
                id={field.name}
                {...field}
                autoFocus
                className={classNames("block w-full", {
                  "p-invalid": fieldState.error,
                })}
              />
            )}
          />
          {getFormErrorMessage("UserName")}
        </div>

        <div className="field col-12">
          <label htmlFor="Password">Mật khẩu</label>
          <Controller
            name="Password"
            control={control}
            rules={{ required: "Mật khẩu không được để trống!" }}
            render={({ field, fieldState }) => (
              <Password
                id={field.name}
                {...field}
                toggleMask
                className={classNames("block w-full", {
                  "p-invalid": fieldState.error,
                })}
                feedback={false}
              />
            )}
          />
          {getFormErrorMessage("Password")}
        </div>
      </form>
    </Dialog>
  );
};

export default Login;
