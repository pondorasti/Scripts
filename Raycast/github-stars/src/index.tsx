import { useEffect, useState } from "react";
import { List, Icon, Color, ImageMask } from "@raycast/api";
import stars, { IResponse } from "./utils/stars";

export default function Command() {
  const [response, setResponse] = useState<IResponse | null>(null);

  useEffect(() => {
    async function fetchStars() {
      const res = await stars("pondorasti");
      setResponse(res);
    }
    fetchStars();
  }, []);

  return (
    <List searchBarPlaceholder="Search username" isLoading={!response}>
      {response &&
        (response.message ? (
          <List.Item title={response.message} icon={{ source: Icon.ExclamationMark, tintColor: Color.Red }} />
        ) : (
          <>
            <List.Item title={`${response.stars} total stars`} icon={{ source: Icon.Star, tintColor: Color.Yellow }} />
            {response.repos.map(({ name, description, stargazers_count, owner }) => (
              <List.Item
                title={name}
                subtitle={description}
                accessoryTitle={`${stargazers_count}  ★`}
                icon={{
                  source: owner.avatar_url,
                  mask: ImageMask.Circle,
                }}
              />
            ))}
          </>
        ))}
    </List>
  );
}
