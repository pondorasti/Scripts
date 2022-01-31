import { List, Detail, Icon } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 200);
  }, []);

  return (
    <List searchBarPlaceholder="Search username" isLoading={isLoading}>
      {!isLoading && (
        <>
          <List.Item title="Augustiner Helles" />
          <List.Item title="Camden Hells" />
          <List.Item title="Leffe Blonde" />
          <List.Item title="Sierra Nevada IPA" />
        </>
      )}
    </List>
  );
}
