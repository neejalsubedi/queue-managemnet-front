import { apiService } from "@/api";
import { useApiMutation } from "@/components/ApiCall/ApiMutation";
import { Button } from "@/components/ui/button";

import { decryptId } from "@/utility/cryptoUtil";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Permission = {
  id: number;
  name: string;
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

const PermissionTable = () => {
  const [data, setData] = useState<Permission[]>([]);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const decryptedId = id ? decryptId(decodeURIComponent(id)) : null;

  useEffect(() => {
    if (id) {
      const fetchRoleModules = async () => {
        try {
          const response = await apiService.get(
            `api/role/modules/${decryptedId}`
          );
          setData(response.data?.data || []);
        } catch (error) {
          console.error("Error fetching role modules:", error);
        }
      };
      fetchRoleModules();
    }
  }, [id]);

  const updateModules = useApiMutation(
    "put",
    `api/role/modules/${decryptedId}`
  );

  const handleUpdateModules = () => {
    updateModules.mutate(data, {
      onSuccess: () => {
        navigate("/role-management");
      },
    });
  };

  const handleCheckboxChange = (id: number, field: keyof Permission) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  const handleSelectAllToggle = (id: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              // If all are checked, uncheck all. Otherwise, check all.
              canRead: !(
                item.canRead &&
                item.canWrite &&
                item.canUpdate &&
                item.canDelete
              ),
              canWrite: !(
                item.canRead &&
                item.canWrite &&
                item.canUpdate &&
                item.canDelete
              ),
              canUpdate: !(
                item.canRead &&
                item.canWrite &&
                item.canUpdate &&
                item.canDelete
              ),
              canDelete: !(
                item.canRead &&
                item.canWrite &&
                item.canUpdate &&
                item.canDelete
              ),
            }
          : item
      )
    );
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="overflow-x-auto space-y-3">
        <div className="flex justify-between">
          <header>
            <h1 className="text-3xl font-bold text-foreground">
              Permission Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage role-based permissions and control access to system
              features.
            </p>
          </header>
          <div className="flex items-center gap-3">
            <Button
              size={"sm"}
              variant={"outline"}
              className="border-gray-400"
              onClick={handleBackButton}
            >
              <ArrowLeft />
            </Button>
            <Button onClick={handleUpdateModules}>Save Changes</Button>
          </div>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left">
                Menu
              </th>
              <th className="flex items-center justify-center gap-2 border border-gray-300 bg-gray-100 px-4 py-2 cursor-pointer">
                <label className="cursor-pointer ">Select All</label>
                {/* <input
                type="checkbox"
                checked={selectAll}
                // onChange={handleSelectAllChange}
                className="h-5 w-5 accent-blue-500 rounded-sm cursor-pointer"
              /> */}
              </th>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2">
                Can Read
              </th>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2">
                Can Write
              </th>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2">
                Can Update
              </th>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2">
                Can Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 font-medium text-left">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={
                      item.canRead &&
                      item.canWrite &&
                      item.canUpdate &&
                      item.canDelete
                    }
                    // onChange={() => {
                    //   handleCheckboxChange(item.id, "canRead");
                    //   handleCheckboxChange(item.id, "canWrite");
                    //   handleCheckboxChange(item.id, "canUpdate");
                    //   handleCheckboxChange(item.id, "canDelete");
                    // }}
                    onChange={() => handleSelectAllToggle(item.id)}
                    className="h-5 w-5 accent-blue-500 rounded-sm cursor-pointer"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.canRead}
                    onChange={() => handleCheckboxChange(item.id, "canRead")}
                    className="h-4 w-4 accent-blue-500 rounded-full cursor-pointer"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.canWrite}
                    onChange={() => handleCheckboxChange(item.id, "canWrite")}
                    className="h-4 w-4 accent-blue-500 rounded-full cursor-pointer"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.canUpdate}
                    onChange={() => handleCheckboxChange(item.id, "canUpdate")}
                    className="h-4 w-4 accent-blue-500 rounded-full cursor-pointer"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.canDelete}
                    onChange={() => handleCheckboxChange(item.id, "canDelete")}
                    className="h-4 w-4 accent-blue-500 rounded-full cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PermissionTable;
