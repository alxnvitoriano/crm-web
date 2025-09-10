import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CompanyForm from "./components/form";

const CompanyFormPage = () => {
  return (
    <Dialog open>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar compania</DialogTitle>
            <DialogDescription>Complete o cadastro da compania para continuar.</DialogDescription>
          </DialogHeader>
          <CompanyForm />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CompanyFormPage;
