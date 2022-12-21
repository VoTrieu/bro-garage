import { useRef, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import { changePasswordRequest } from "../../store/auth-actions";
import { uiActions } from "../../store/ui-slice";

const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const isShowChangePasswordDialog = useSelector(
    (state) => state.ui.isShowChangePasswordDialog
  );
  const { errorMessage, changePasswordSuccess } = useSelector((state) => state.auth);

  const defaultValues = {
    CurrentPassword: "",
    NewPassword: "",
    NewPasswordConfirm: "",
  };

  const {
    control,
    formState: { errors, isSubmitting},
    handleSubmit,
    reset,
    getValues,
  } = useForm({ defaultValues });

  const onHideChangePasswordForm = () => {
    dispatch(uiActions.showChangePasswordDialog(false));
  };

  const onChangePassword = () => {
    formRef.current.requestSubmit();
  };

  const onSubmit = (formValue, e) => {
    e.nativeEvent.preventDefault();
    dispatch(changePasswordRequest(formValue));
    reset(defaultValues);
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const changePasswordDialogFooter = (
    <Fragment>
      <Button
        label="Thoát"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHideChangePasswordForm}
      />
      <Button
        disabled={isSubmitting}
        label="Đổi mật khẩu"
        icon="pi pi-check"
        className="p-button-text"
        onClick={onChangePassword}
      />
    </Fragment>
  );

  return (
    <Dialog
      visible={isShowChangePasswordDialog}
      style={{ width: "450px" }}
      header="Đổi mật khẩu"
      modal
      className="p-fluid"
      footer={changePasswordDialogFooter}
      onHide={onHideChangePasswordForm}
    >
      {!changePasswordSuccess && (
        <Message
          className="mb-3 justify-content-start"
          severity="error"
          sticky={true}
          closable={true}
          text={errorMessage}
        />
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="formgrid grid"
      >
        <div className="field col-12">
          <label htmlFor="CurrentPassword">Mật khẩu hiện tại</label>
          <Controller
            name="CurrentPassword"
            control={control}
            rules={{ required: "Mật khẩu hiện tại không được để trống!" }}
            render={({ field, fieldState }) => (
              <Password
                value={field.value}
                onChange={(e) => field.onChange(e)}
                toggleMask
                autoComplete="current-password"
                className={classNames("block w-full", {
                  "p-invalid": fieldState.error,
                })}
                feedback={false}
              />
            )}
          />
          {getFormErrorMessage("CurrentPassword")}
        </div>

        <div className="field col-12">
          <label htmlFor="NewPassword">Mật khẩu mới</label>
          <Controller
            name="NewPassword"
            control={control}
            rules={{ 
              required: "Mật khẩu mới không được để trống!" ,
              validate: {
                isMatched: (value) =>{
                  const confirPass =  getValues('NewPasswordConfirm');
                  if(value !== confirPass){
                    return "Mật khẩu mới không trùng khớp!"
                  }
                  return true;
                }
              }
            }}
            render={({ field, fieldState }) => (
              <Password
                value={field.value}
                onChange={(e) => field.onChange(e)}
                toggleMask
                autoComplete="new-password"
                className={classNames("block w-full", {
                  "p-invalid": fieldState.error,
                })}
              />
            )}
          />
          {getFormErrorMessage("NewPassword")}
        </div>

        <div className="field col-12">
          <label htmlFor="NewPasswordConfirm">Xác nhận mật khẩu mới</label>
          <Controller
            name="NewPasswordConfirm"
            control={control}
            rules={{ 
              required: "Xác nhận mật khẩu mới không được để trống!",
              validate: {
                isMatched: (value) =>{
                  const newPass =  getValues('NewPassword');
                  if(value !== newPass){
                    return "Mật khẩu mới không trùng khớp!"
                  }
                  return true;
                }
              } 
            }}
            render={({ field, fieldState }) => (
              <Password
                value={field.value}
                onChange={(e) => field.onChange(e)}
                toggleMask
                autoComplete="new-password-confirm"
                className={classNames("block w-full", {
                  "p-invalid": fieldState.error,
                })}
              />
            )}
          />
          {getFormErrorMessage("NewPasswordConfirm")}
        </div>
      </form>
    </Dialog>
  );
};

export default ChangePassword;
